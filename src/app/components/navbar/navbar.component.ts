import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../security/login/login.component';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    standalone: true,
    imports: [Menubar, BadgeModule, AvatarModule, InputTextModule, Ripple, CommonModule, LoginComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar implements OnInit {
    items: MenuItem[] | undefined;
    
    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Mamelungas',
                icon: 'pi pi-home',
            },
            {
                label: 'Projects',
                icon: 'pi pi-search',
                badge: '3',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                    },
                ],
            },
        ];
    }

    loggedIn() {
        return this.authService.isLoggedIn();
    }
}