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

  async initializeFavouriteLists(): Promise<void> { 
    const userId = this.authService.getCurrentActor()?.id;
    if (!userId) return;

    const userLists = await this.getUserLists();
    if (!await this.existUserEntry()) {
      const newUserEntry = {
        id: userId,
        favouriteList: []
      };
      await axios.post(backendURL, newUserEntry);
    }

    this.favouriteListsSubject.next(userLists || []);
  }

  private async existUserEntry(): Promise<boolean> {
    const userId = this.authService.getCurrentActor()?.id;
    if (!userId) return false;

    try {
      const response = await axios.get<{ id: string }[]>(backendURL);
      return response.data.some(entry => entry.id === userId);
    } catch (error) {
      console.error("Error checking user entry:", error);
      return false;
    }
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
    const newList = new FavouriteList(`list-${Date.now()}`, name, [], 0, false);
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

  async getListById(id: string): Promise<FavouriteList | undefined> {
    const lists = this.getLocalData();
    return lists.find(list => list.id === id);
  }

  async deleteTripFromList(listId: string, tripId: string): Promise<void> {
    const lists = this.getLocalData().map(list => {
      if (list.id === listId) {
        const updatedTripLinks = (list.tripLinks ?? []).filter(tripLink => tripLink !== tripId);
        return new FavouriteList(list.id, list.name, updatedTripLinks, list.version, list.deleted);
      }
      return list;
    });
    this.saveLocalData(lists);
    this.favouriteListsSubject.next(lists.filter(list => !list.deleted));
    await this.syncToServer(lists);
  }

  async addTripToList(listId: string, tripId: string): Promise<void> {
    const lists = this.getLocalData().map(list => {
      if (list.id === listId) {
        const updatedTripLinks = list.tripLinks?.includes(tripId)
          ? list.tripLinks
          : [...(list.tripLinks ?? []), tripId];
        return new FavouriteList(list.id, list.name, updatedTripLinks, list.version, list.deleted);
      }
      return list;
    });
    this.saveLocalData(lists);
    this.favouriteListsSubject.next(lists.filter(list => !list.deleted));
    await this.syncToServer(lists);
  }
}
