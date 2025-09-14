import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Calendar, Clock, MapPin, LucideAngularModule, Heart, Gift, Camera, Users } from 'lucide-angular';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, MatCardModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  readonly heartIcon = Heart;

  isMobile: boolean = window.innerWidth <= 768;
  isLogged: boolean = false;
  guestsRoute: string = '/convidados';
  giftsRoute: string = '/presentes';

  scrollY: number = 0;
  floatingElements: Array<{ left: string, top: string, animationDelay: string, animationDuration: string }> = [];
  visibleSections: Set<string> = new Set();
  timeLeft: { days: number, hours: number, minutes: number, seconds: number } = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  timeLeftArray: { value: number, label: string }[] = [];

  weddingDate = new Date('2026-09-06');

  cards: { icon: any, title: string, content: string[] }[] = [
    { icon: Calendar, title: 'Data & Horário', content: ['06 de Setembro de 2026', 'Cerimonia: 10:00h', 'Reception: 14:00h'] },
    { icon: MapPin, title: 'Localização', content: ['Cerimonia: Capela Santa Terezinha'] },
    { icon: Clock, title: 'Dress Code', content: ['Traje Esporte Fino', 'Cores sugeridas:', 'Azul Marinho, Bordô, Cinza'] },
  ]

  quickCards: { icon: any, title: string, description: string, route: string }[] = [
    { icon: Users, title: "Convidados", description: "Lista de convidados e mapa de lugares", route: "/convidados" },
    { icon: Camera, title: "Padrinhos", description: "Conheça nossos padrinhos e madrinhas", route: "/padrinhos" },
    {
      icon: Gift,
      title: "Lista de Presentes",
      description: "Presentes que nos ajudarão a começar nossa vida juntos",
      route: "/presentes",
    },
    { icon: Heart, title: "Nossa História", description: "Como tudo começou e chegamos até aqui", route: "#" },
  ]

  constructor(private readonly loginService: LoginService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMobile = (event.target as Window).innerWidth <= 768;
  }

  checkSectionVisibility(): void {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      this.visibleSections.add(rect.top <= window.innerHeight && rect.bottom >= 0 ? section.id : '');
    });
  }

  ngOnInit(): void {
    this.checkSectionVisibility();
    this.scrollY = window.scrollY;

    setInterval(() => {
      this.floatingElements = this.generateFloatingElements();
    }, 1500);

    this.loginService.$toggleLoggedIn.subscribe(res => {
      this.isLogged = res;
      this.guestsRoute = this.isLogged ? '/admin/convidados' : '/convidados';
      this.giftsRoute = this.isLogged ? '/admin/presentes' : '/presentes';
    })

    this.calculateTimeLeft();
  }

  calculateTimeLeft(): () => void {
    const timer = setInterval(this.updateCountdown.bind(this), 1000);
    return () => clearInterval(timer);
  }

  updateCountdown(): void {
    const now = new Date();
    const diff = this.weddingDate.getTime() - now.getTime();

    if (diff > 0) {
      this.timeLeft.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.timeLeft.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.timeLeft.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.timeLeft.seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.timeLeftArray = [
        { value: this.timeLeft.days, label: 'Dias' },
        { value: this.timeLeft.hours, label: 'Horas' },
        { value: this.timeLeft.minutes, label: 'Minutos' },
        { value: this.timeLeft.seconds, label: 'Segundos' }
      ];
    } else {
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.scrollY = window.scrollY;
    this.checkSectionVisibility();
  }

  calculateOpacity(): number {
    return Math.min(0.3 + this.scrollY * 0.0005, 0.6);
  }

  getParallaxTransform(): string {
    const translateY = this.scrollY * 0.5;
    const scale = 1 + this.scrollY * 0.0002;
    const transform = `translateY(${translateY}px) scale(${scale})`;
    return transform;
  }

  generateFloatingElements(): Array<{ left: string, top: string, animationDelay: string, animationDuration: string }> {
    return Array.from({ length: 20 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 4}s`
    }));
  }

  generateCalendarEvent(): void {
    // TODO: atualizar para a data real
    const startDate = "20260906T130000Z"
    const endDate = "20260906T160000Z"
    const title = "Casamento Hellen & Adrian";
    const details = "Cerimônia: Capela Santa Terezinha | Recepção: Quinta dos Sonhos";
    const location = "Capela Santa Terezinha";

    const query = `action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?${query}`;

    window.open(googleCalendarUrl, "_blank");
  }
}
