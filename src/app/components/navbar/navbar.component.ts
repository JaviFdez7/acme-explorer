import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    standalone: true,
    imports: [Menubar, BadgeModule, AvatarModule, InputTextModule, CommonModule]
})
export class Navbar implements OnInit {
    items: MenuItem[] | undefined;

    constructor(private router: Router) {}

    

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                command: () => this.router.navigate(['/'])
            },
            {
                label: 'Projects',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        command: () => this.router.navigate(['/register'])
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
            {
                label: 'About',
                icon: 'pi pi-list',
                command: () => this.router.navigate(['/'])
            },
        ];
    }
}