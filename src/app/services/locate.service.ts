import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocateService {
    private currentLanguage = new BehaviorSubject<string>(
        typeof window !== 'undefined' && typeof localStorage !== 'undefined' && localStorage.getItem('locale')
            ? localStorage.getItem('locale')!
            : 'en'
    );

    
    changeLanguage = (lang: string) => {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.setItem('locale', lang);
            location.reload();
        } else {
            console.warn('localStorage is not available in this environment.');
        }
        localStorage.setItem('locale', lang);
    }


    getCurrentLanguage(): Observable<string> {
        return this.currentLanguage.asObservable();
    }

    getCurrentLanguageValue(): string {
        return this.currentLanguage.value;
    }

    translate(key: string): string {
        const translations: { [key: string]: { [lang: string]: string } } = {
            'Home': { 'en': 'Home', 'es': 'Inicio' },
            'Trips': { 'en': 'Trips', 'es': 'Viajes' },
            'ESP': { 'en': 'SP', 'es': 'ESP' },
            'ENG': { 'en': 'ENG', 'es': 'ING' },
            'Login': { 'en': 'Login', 'es': 'Iniciar sesión' },
            'Register': { 'en': 'Register', 'es': 'Registrarse' },
            'Profile': { 'en': 'Profile', 'es': 'Perfil' },
            'My Profile': { 'en': 'My Profile', 'es': 'Mi Perfil' },
            'Logout': { 'en': 'Logout', 'es': 'Cerrar sesión' },
            'Explorer': { 'en': 'Explorer', 'es': 'Explorador' },
            'My Applications': { 'en': 'My Applications', 'es': 'Mis Solicitudes' },
            'My Favourite Lists': { 'en': 'My Favourite Lists', 'es': 'Mis Listas Favoritas' },
            'Manager': { 'en': 'Manager', 'es': 'Gestor' },
            'My Trips': { 'en': 'My Trips', 'es': 'Mis Viajes' },
            'Admin': { 'en': 'Admin', 'es': 'Administrador' },
            'Create User': { 'en': 'Create User', 'es': 'Crear Usuario' },
            'Dashboard': { 'en': 'Dashboard', 'es': 'Panel de Control' },
            'Sponsorship Configuration': { 'en': 'Sponsorship Configuration', 'es': 'Configuración de Patrocinios' },
            'Cube': { 'en': 'Cube', 'es': 'Cubo' },
            'Sponsor': { 'en': 'Sponsor', 'es': 'Patrocinador' },
            'Create Sponsorship': { 'en': 'Create Sponsorship', 'es': 'Crear Patrocinio' },
            'My Sponsorships': { 'en': 'My Sponsorships', 'es': 'Mis Patrocinios' },
            '€': { 'en': '$', 'es': '€' },
        };

        const lang = this.currentLanguage.value;
        return translations[key]?.[lang] || key;
    }
}