import { Component, OnInit, OnDestroy, ElementRef, Inject, PLATFORM_ID  } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../../api.service';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { navItems } from '../../_nav';
import {  FooterModule,HeaderModule,SidebarModule,BreadcrumbModule,NavModule } from '@coreui/angular';



import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [FooterModule,HeaderModule,SidebarModule,BreadcrumbModule,NavModule,RouterOutlet,NgxSpinnerModule,CommonModule,RouterModule ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent implements OnDestroy {

  navbarBrandFull = {
    
    src: 'assets/Majid Al Futtaim Logo.png',
    width: 177,
    height: 35,
    alt: 'MAF Logo'
  };
  public navItems = navItems;
  public sidebarMinimized = false;
  private changes: MutationObserver | null = null;
  public element: HTMLElement;
  loginUserName: string;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isUser: boolean = false;

  constructor(public router: Router, private service: ApiService,@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object
) {
    
   
  }

  ngOnDestroy(): void {
    if (this.changes) {
      this.changes.disconnect();
    }
  }

  
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.element = this.document.body;
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = this.document.body.classList.contains('sidebar-minimized');
    });
    this.changes.observe(this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

    console.log("Layout");
    // this.service.getUserName().subscribe((res:any) => {
    //   if (res != null && res != '') {
    //     let user = res as any;
        this.loginUserName ='veerender.kumar-e@maf.ae';// user.d.Email;
       // this.DisplayName ='Veerender Kumar';// user.d.Title;
       // this.loginUserName = user.d.Email;
      //}

      this.isAdmin = false;
      this.isSuperAdmin = true;
      this.isUser = false;

      // this.service.getEmployee(this.loginUserName).subscribe((res:any) => {
      //   alert(this.isSuperAdmin);
      //   if (res != null && res != '') {
      //     let users = res as any;
      //     const c: any  = users.d.results[0] as [];
      //    let user_role = c.Role;
      //     if(user_role != null && user_role.length > 0) {
      //       if (user_role == 'Super Admin') {
      //         this.isAdmin = false;
      //         this.isSuperAdmin = true;
      //         this.isUser = false;
      //         alert(this.isSuperAdmin);
      //       } else if (user_role == 'Admin') {
      //         this.isAdmin = true;
      //         this.isSuperAdmin = false;
      //         this.isUser = false;
      //        } else if (user_role == 'User') {
      //         this.isAdmin = false;
      //         this.isSuperAdmin = false;
      //         this.isUser = true;
      //       }
      //     }
      //   }
      // }), (err:any) => {
      //   alert("fsdf");
      //   console.log("Error Occured " + err);
      // };
    // }), (err:any) => {
    //   console.log("Error Occured " + err);
    // };
    // this.showSuccess();
  }
  showDashboardLinks(): boolean {
    return (
      this.router.url === '/dashboard' ||
      this.router.url.startsWith('/dashboard/')
    );
  }
}
