import { Injectable } from '@angular/core';
import { definePreset } from '@primeng/themes'
import Aura from '@primeng/themes/aura';
import { usePreset } from '@primeng/themes';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    currentColor: string = '#3F51B5';
    private darkMode = new BehaviorSubject<boolean>(false);

    setDarkModeSelector = () => {
        const element = document.querySelector('html');
        if (element !== null) {
            element.classList.toggle('my-app-dark');
            const newDarkModeState = !this.darkMode.getValue();
            this.darkMode.next(newDarkModeState);
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                localStorage.setItem('darkMode', JSON.stringify(newDarkModeState));
            }
        }
    };

    initializeDarkMode() {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const cachedDarkMode = localStorage.getItem('darkMode');
            const isDarkMode = cachedDarkMode ? JSON.parse(cachedDarkMode) : false;
            this.darkMode.next(isDarkMode);
            const element = document.querySelector('html');
            if (element !== null && isDarkMode) {
                element.classList.add('my-app-dark');
            }
        }
    }

    isDarkModeEnabled(): Observable<boolean> {
        return this.darkMode.asObservable();
    }

    getCurrentColor() {
        return this.currentColor;
    }

    setCurrentColor(color: string) {
        this.currentColor = color;
    }

    setPreset = (color: string) => {
        let finalColor;
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            if (color === 'initial') {
                const cachedColor = localStorage.getItem('currentColor');
                if (cachedColor) {
                    finalColor = cachedColor;
                } else {
                    finalColor = 'indigo';
                    localStorage.setItem('currentColor', finalColor);
                }
            } else {
                finalColor = color;
                localStorage.setItem('currentColor', finalColor);
            }
        } else {
            finalColor = color === 'initial' ? 'indigo' : color; 
        }

        const newPreset = definePreset(Aura, {
            semantic: {
                colorScheme: {
                    light: {
                        primary: {
                            50: `{${finalColor}.50}`,
                            100: `{${finalColor}.100}`,
                            200: `{${finalColor}.200}`,
                            300: `{${finalColor}.300}`,
                            400: `{${finalColor}.400}`,
                            500: `{${finalColor}.500}`,
                            600: `{${finalColor}.600}`,
                            700: `{${finalColor}.700}`,
                            800: `{${finalColor}.800}`,
                            900: `{${finalColor}.900}`,
                            950: `{${finalColor}.950}`,
                        },
                    },
                    dark: {
                        primary: {
                            50: `{${finalColor}.50}`,
                            100: `{${finalColor}.100}`,
                            200: `{${finalColor}.200}`,
                            300: `{${finalColor}.300}`,
                            400: `{${finalColor}.400}`,
                            500: `{${finalColor}.500}`,
                            600: `{${finalColor}.600}`,
                            700: `{${finalColor}.700}`,
                            800: `{${finalColor}.800}`,
                            900: `{${finalColor}.900}`,
                            950: `{${finalColor}.950}`,
                        },
                    },
                }
            }
        });
        usePreset(newPreset);
    }
}
