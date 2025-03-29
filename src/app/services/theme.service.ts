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
            this.darkMode.next(!this.darkMode.getValue());
        }
    };

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
        const newPreset = definePreset(Aura, {
            semantic: {
                colorScheme: {
                    light: {
                        primary: {
                            50: `{${color}.50}`,
                            100: `{${color}.100}`,
                            200: `{${color}.200}`,
                            300: `{${color}.300}`,
                            400: `{${color}.400}`,
                            500: `{${color}.500}`,
                            600: `{${color}.600}`,
                            700: `{${color}.700}`,
                            800: `{${color}.800}`,
                            900: `{${color}.900}`,
                            950: `{${color}.950}`,
                        },
                    },
                    dark: {
                        primary: {
                            50: `{${color}.50}`,
                            100: `{${color}.100}`,
                            200: `{${color}.200}`,
                            300: `{${color}.300}`,
                            400: `{${color}.400}`,
                            500: `{${color}.500}`,
                            600: `{${color}.600}`,
                            700: `{${color}.700}`,
                            800: `{${color}.800}`,
                            900: `{${color}.900}`,
                            950: `{${color}.950}`,
                        },
                    },
                }
            }
        })
        usePreset(newPreset);
    }
}
