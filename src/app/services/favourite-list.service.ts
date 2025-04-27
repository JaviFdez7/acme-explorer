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
    return data
      ? JSON.parse(data).map((list: any) => new FavouriteList(list.id, list.name, list.tripLinks, list.version, list.deleted))
      : [];
  }

  private saveLocalData(data: FavouriteList[]): void {
    const plainData = data.map(list => list.object); // Convert instances to plain objects
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plainData));
  }

  private async fetchRemoteLists(): Promise<FavouriteList[]> {
    if (!this.authService.getCurrentActor())
      return []
    const userId = this.authService.getCurrentActor()?.id || 'anonymous';
    try {
      const response = await axios.get<{ favouriteList: any[] }>(`${backendURL}/${userId}`);
      return response.data.favouriteList.map(list => new FavouriteList(list.id, list.name, list.tripLinks, list.version, list.deleted));
    } catch {
      return [];
    }
  }

  private async syncToServer(lists: FavouriteList[]): Promise<void> {
    if (!this.authService.getCurrentActor()) return;
    const userId = this.authService.getCurrentActor()?.id || 'anonymous';
    await axios.put(`${backendURL}/${userId}`, { favouriteList: lists.map(list => list.object) });
  }

  private async getUserLists(): Promise<FavouriteList[]> {
    const localLists = this.getLocalData();
    const remoteLists = await this.fetchRemoteLists();
    const mergedLists = this.mergeLists(localLists, remoteLists);
    this.saveLocalData(mergedLists);
    if (mergedLists.length !== remoteLists.length)
      await this.syncToServer(mergedLists);
    return mergedLists.filter(list => !list.deleted);
  }

  private mergeLists(localLists: FavouriteList[], remoteLists: FavouriteList[]): FavouriteList[] {
    const mergedLists = [...localLists, ...remoteLists.filter(remoteList => !localLists.some(localList => localList.id === remoteList.id))];
    return mergedLists.map(list => {
      const localList = localLists.find(local => local.id === list.id);
      if (localList) {
        return new FavouriteList(list.id, list.name, list.tripLinks, Math.max(list.version || 0, localList.version || 0), list.deleted || localList.deleted);
      }
      return list;
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
