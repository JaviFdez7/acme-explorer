import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Actor } from '../../../models/actor.model';
import { ThemeService } from '../../../services/theme.service';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [Menubar, BadgeModule, AvatarModule, InputTextModule, CommonModule, Ripple],
    changeDetection: ChangeDetectionStrategy.Default
})
export class Navbar implements OnInit {
    items: MenuItem[] | undefined = [];    
    currentActor: Actor | null = null;
    activeRole: string | null = 'anonymous';
    selectedColor: string = '';
    themeToggleItem: MenuItem | undefined;
    

    constructor(public authService: AuthService, private router: Router, public themeService: ThemeService) {}

    loggedIn() {
        return this.authService.isLoggedIn();
    }

    ngOnInit() {
        this.selectedColor = this.themeService.getCurrentColor();
        // Menú contextual por rol
        this.authService.getStatus().subscribe(async (loggedIn: boolean) => {
            if(loggedIn){
                this.currentActor = this.authService.getCurrentActor();
                const role = this.currentActor?.role;
                if (role){ 
                    this.activeRole = role.toString().toLowerCase();
                } else {
                    this.activeRole = 'anonymous'
                    this.currentActor = null
                }
            } else {
                this.activeRole = 'anonymous'
                this.currentActor = null
            }
            // Menú común
            let commonNavbar = [
                {
                    label: 'Home',
                    icon: 'pi pi-home',
                    command: () => this.router.navigate(['/'])
                },
                {
                    label: 'Trips',
                    icon: 'pi pi-map',
                    command: () => this.router.navigate(['/trips'])
                },
                {
                    label: 'Finder',
                    icon: 'pi pi-search',
                    command: () => this.router.navigate(['/finder'])
                },
            ];

            this.themeToggleItem = {
                icon: 'pi pi-sun',
                command: () => {
                  this.themeService.setDarkModeSelector();
                }
              };
    
            let configNavbar = [
                {
                    icon: 'pi pi-palette',
                    palette: true,
                    items: [
                        { label: 'Emerald', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('emerald'); this.selectedColor = '#10B981'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#10B981' },
                        { label: 'Green', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('green'); this.selectedColor = '#4CAF50'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#4CAF50' },
                        { label: 'Lime', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('lime'); this.selectedColor = '#CDDC39'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#CDDC39' },
                        { label: 'Red', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('red'); this.selectedColor = '#F44336'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#F44336' },
                        { label: 'Orange', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('orange'); this.selectedColor = '#FF9800'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#FF9800' },
                        { label: 'Amber', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('amber'); this.selectedColor = '#FFC107'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#FFC107' },
                        { label: 'Yellow', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('yellow'); this.selectedColor = '#FFEB3B'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#FFEB3B' },
                        { label: 'Teal', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('teal'); this.selectedColor = '#009688'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#009688' },
                        { label: 'Cyan', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('cyan'); this.selectedColor = '#00BCD4'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#00BCD4' },
                        { label: 'Sky', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('sky'); this.selectedColor = '#38BDF8'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#38BDF8' },
                        { label: 'Blue', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('blue'); this.selectedColor = '#2196F3'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#2196F3' },
                        { label: 'Indigo', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('indigo'); this.selectedColor = '#3F51B5'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#3F51B5' },
                        { label: 'Violet', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('violet'); this.selectedColor = '#8B5CF6'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#8B5CF6' },
                        { label: 'Purple', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('purple'); this.selectedColor = '#9C27B0'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#9C27B0' },
                        { label: 'Fuchsia', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('fuchsia'); this.selectedColor = '#D946EF'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#D946EF' },
                        { label: 'Pink', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('pink'); this.selectedColor = '#D5006D'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#D5006D' },
                        { label: 'Rose', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('rose'); this.selectedColor = '#FF4081'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#FF4081' },
                        { label: 'Slate', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('slate'); this.selectedColor = '#64748B'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#64748B' },
                        { label: 'Gray', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('gray'); this.selectedColor = '#9E9E9E'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#9E9E9E' },
                        { label: 'Zinc', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('zinc'); this.selectedColor = '#71717A'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#71717A' },
                        { label: 'Neutral', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('neutral'); this.selectedColor = '#737373'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#737373' },
                        { label: 'Stone', icon: 'pi pi-palette', command: () => { this.themeService.setPreset('stone'); this.selectedColor = '#78716C'; this.themeService.setCurrentColor(this.selectedColor); }, color: '#78716C' }
                    ]                    
                },
                this.themeToggleItem,
                {
                    icon: 'pi pi-flag',
                },
                {
                    icon: 'pi pi-flag',
                },
            ];

            this.themeService.isDarkModeEnabled().subscribe((darkMode: boolean) => {
                if (this.themeToggleItem) {
                    this.themeToggleItem.icon = darkMode ? 'pi pi-moon' : 'pi pi-sun';
                }
            });
            
            if (this.activeRole === 'anonymous') {
                let registerNavbar = [
                    {
                        label: 'Login',
                        icon: 'pi pi-sign-in',
                        command: () => this.router.navigate(['/login']),
                        style: {'margin-left': 'auto'}
                    },
                    {
                        label: 'Register',
                        icon: 'pi pi-user-plus',
                        command: () => this.router.navigate(['/register'])
                    }
                ];
                this.items = [...commonNavbar, ...registerNavbar, ...configNavbar];
                return;
            }

            let profileNavbar = [
                {
                    label: 'Profile',
                    icon: 'pi pi-user',
                    items: [
                        {
                            label: 'My Profile',
                            icon: 'pi pi-user-edit',
                            command: () => this.router.navigate(['/profile'])
                        },
                        {
                            separator: true
                        },
                        {
                            label: 'Logout',
                            icon: 'pi pi-sign-out',
                            command: () => this.authService.logout()
                        }
                    ]
                }
            ];
            
            switch (this.activeRole) {
                case 'explorer':
                    let explorerNavbar = [
                        {
                            label: 'Explorer',
                            icon: 'pi pi-user',
                            style: {'margin-left': 'auto'},
                            items: [
                                {
                                    label: 'My Applications',
                                    icon: 'pi pi-file',
                                    command: () => this.router.navigate(['/applications'])
                                },
                                {
                                    label: 'Favourites',
                                    icon: 'pi pi-star',
                                    command: () => this.router.navigate(['/favourites'])
                                }
                            ]
                        }
                    ]
                    
                    this.items = [...commonNavbar, ...explorerNavbar, ...profileNavbar, ...configNavbar];

                    break;
                case 'manager':
                    this.items?.push({
                        label: 'Manager',
                        icon: 'pi pi-briefcase',
                        items: [
                            {
                                label: 'My Trips',
                                icon: 'pi pi-sitemap',
                                command: () => this.router.navigate(['/my-trips'])
                            },
                            {
                                label: 'Trip Applications',
                                icon: 'pi pi-inbox',
                                command: () => this.router.navigate(['/trip-applications'])
                            },
                            {
                                separator: true
                            },
                            {
                                label: 'Logout',
                                icon: 'pi pi-sign-out',
                                command: () => this.authService.logout()
                            }
                        ]
                    });
                    break;

                case 'admin':
                    this.items?.push({
                        label: 'Admin',
                        icon: 'pi pi-cog',
                        items: [
                            {
                                label: 'Dashboard',
                                icon: 'pi pi-chart-bar',
                                command: () => this.router.navigate(['/admin/dashboard'])
                            },
                            {
                                label: 'Create Manager',
                                icon: 'pi pi-user-plus',
                                command: () => this.router.navigate(['/admin/new-manager'])
                            },
                            {
                                label: 'Sponsorship Config',
                                icon: 'pi pi-sliders-h',
                                command: () => this.router.navigate(['/admin/sponsorship-settings'])
                            },
                            {
                                separator: true
                            },
                            {
                                label: 'Logout',
                                icon: 'pi pi-sign-out',
                                command: () => this.authService.logout()
                            }
                        ]
                    });
                    break;

                case 'sponsor':
                    this.items?.push({
                        label: 'Sponsor',
                        icon: 'pi pi-dollar',
                        items: [
                            {
                                label: 'My Sponsorships',
                                icon: 'pi pi-tag',
                                command: () => this.router.navigate(['/sponsorships'])
                            },
                            {
                                label: 'Create Sponsorship',
                                icon: 'pi pi-plus',
                                command: () => this.router.navigate(['/sponsorships/new'])
                            },
                            {
                                separator: true
                            },
                            {
                                label: 'Logout',
                                icon: 'pi pi-sign-out',
                                command: () => this.authService.logout()
                            }
                        ]
                    });
                    break;
            }
        });
    }
}