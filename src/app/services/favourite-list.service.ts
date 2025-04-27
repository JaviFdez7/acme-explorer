import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import { AuthService } from './auth.service';
import { FavouriteList } from '../models/favourite-list.model';

const LOCAL_STORAGE_KEY = 'favourite_lists';
const backendURL = 'http://localhost:3000/favourite-lists'; 

@Injectable({
  providedIn: 'root'
})
export class FavouriteListService {
  private favouriteListsSubject = new BehaviorSubject<FavouriteList[]>([]);
  favouriteLists$ = this.favouriteListsSubject.asObservable();

  constructor(private authService: AuthService) {
    this.initializeFavouriteLists();
  }

  private async initializeFavouriteLists(): Promise<void> {
    const userLists = await this.getUserLists();
    this.favouriteListsSubject.next(userLists || []);
  }

  private getLocalData(): FavouriteList[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data).map((list: any) => new FavouriteList(list.id, list.name, list.tripLinks, list.version, list.deleted)) : [];
  }

  private saveLocalData(data: FavouriteList[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }

  private async fetchRemoteLists(): Promise<FavouriteList[]> {
    if (!this.authService.isLoggedIn()) return [];
    const userId = this.authService.getCurrentActor()?.id || 'anonymous';
    try {
      const response = await axios.get<{ favouriteList: any[] }>(`${backendURL}/${userId}`);
      return response.data.favouriteList.map(list => new FavouriteList(list.id, list.name, list.tripLinks, list.version, list.deleted));
    } catch {
      return [];
    }
  }

  private async syncToServer(lists: FavouriteList[]): Promise<void> {
    if (!this.authService.isLoggedIn()) return;
    const userId = this.authService.getCurrentActor()?.id || 'anonymous';
    await axios.put(`${backendURL}/${userId}`, { favouriteList: lists.map(list => list.object) });
  }

  private async getUserLists(): Promise<FavouriteList[]> {
    const localLists = this.getLocalData();
    console.log('Local lists:', localLists);
    const remoteLists = await this.fetchRemoteLists();
    const mergedLists = this.mergeLists(localLists, remoteLists);
    this.saveLocalData(mergedLists);
    await this.syncToServer(mergedLists);
    return mergedLists.filter(list => !list.deleted);
  }

  private mergeLists(localLists: FavouriteList[], remoteLists: FavouriteList[]): FavouriteList[] {
    const allLists = [...localLists, ...remoteLists];
    const uniqueIds = Array.from(new Set(allLists.map(list => list.id)));
    return uniqueIds.map(id => {
      const local = localLists.find(list => list.id === id);
      const remote = remoteLists.find(list => list.id === id);
      return local && remote
        ? new Date(local.object.editTime) > new Date(remote.object.editTime)
          ? local
          : remote
        : local || remote!;
    });
  }

  async createList(name: string): Promise<FavouriteList> {
    const newList = new FavouriteList(`list-${Date.now()}`, name);
    const lists = [...this.getLocalData(), newList];
    this.saveLocalData(lists);
    this.favouriteListsSubject.next(lists.filter(list => !list.deleted));
    await this.syncToServer(lists);
    return newList;
  }

  async updateList(updatedList: FavouriteList): Promise<void> {
    const lists = this.getLocalData().map(list =>
      list.id === updatedList.id ? updatedList : list
    );
    this.saveLocalData(lists);
    this.favouriteListsSubject.next(lists.filter(list => !list.deleted));
    await this.syncToServer(lists);
  }

  async deleteList(id: string): Promise<void> {
    const lists = this.getLocalData().map(list =>
      list.id === id ? new FavouriteList(list.id, list.name, list.tripLinks, list.version, true) : list
    );
    this.saveLocalData(lists);
    this.favouriteListsSubject.next(lists.filter(list => !list.deleted));
    await this.syncToServer(lists);
  }
}
