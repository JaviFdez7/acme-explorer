import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginComponent } from '../../security/login/login.component';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [Menubar, BadgeModule, AvatarModule, InputTextModule, CommonModule, LoginComponent],
    changeDetection: ChangeDetectionStrategy.Default
})
export class Navbar implements OnInit {
    leftItems: MenuItem[] | undefined;    
    rightItems: MenuItem[] | undefined;    

    constructor(private authService: AuthService, private router: Router) {}

    loggedIn() {
        return this.authService.isLoggedIn();
    }

    async getLoggedUserRole() {
        return await this.authService.getUserRole();
    }

    ngOnInit() {
        // Menú común
        this.leftItems = [
            {
                label: 'Home',
                icon: 'pi pi-home',
                command: () => this.router.navigate(['/'])
            },
            {
                label: 'Trips',
                icon: 'pi pi-map',
                command: () => this.router.navigate(['/trip'])
            },
            {
                label: 'Finder',
                icon: 'pi pi-search',
                command: () => this.router.navigate(['/finder'])
            }
        ];

        // Menú contextual por rol
        this.authService.user$.subscribe(async user => {
            const baseRight: MenuItem[] = [];
            if (!user) {
                // Visitante
                this.rightItems = [
                    {
                        label: 'Register',
                        icon: 'pi pi-user-plus',
                        command: () => this.router.navigate(['/register'])
                    }
                ];
                return;
            }
            let role = "explorer";
            switch (role) {
                case 'explorer':
                    baseRight.push({
                        label: 'Explorer',
                        icon: 'pi pi-user',
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
                            },
                            {
                                label: 'Settings',
                                icon: 'pi pi-cog',
                                command: () => this.router.navigate(['/settings'])
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
                case 'manager':
                    baseRight.push({
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
                    baseRight.push({
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
                    baseRight.push({
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

            this.rightItems = baseRight;
        });
    }
}