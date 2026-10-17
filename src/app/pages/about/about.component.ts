import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { cut, photo } from '../../core/data/images';
import { ArtComponent } from '../../shared/components/art.component';
import { IconComponent } from '../../shared/components/icon.component';
import { CtaBandComponent, PageHeroComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [PageHeroComponent, ArtComponent, IconComponent, CtaBandComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  constructor() {
    inject(Title).setTitle('About us | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'We are a team of weavers and makers turning natural cane into furniture and decor that feels at home in modern spaces.' });
  }

  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'About us' }];
  protected readonly timeline = [
    { year: 'Year to be supplied', title: 'The beginning', text: 'How the workshop started and who began weaving. Replace with the founder’s own story.' },
    { year: 'Year to be supplied', title: 'Growing the craft', text: 'Moving from small orders to furniture, lamps and swings.' },
    { year: 'Year to be supplied', title: 'Today', text: 'A team of artisans making handwoven pieces for homes and spaces.' },
  ];
  protected readonly materials = [
    { icon: 'leaf', title: 'Cane and fibres', text: 'Natural cane, rope and seasoned wood, selected for strength and colour.' },
    { icon: 'hand', title: 'Hand techniques', text: 'Splitting, soaking, bending and weaving, all by hand.' },
    { icon: 'shield', title: 'Finishing', text: 'Sanding, sealing and checking each piece before it leaves the workshop.' },
  ];
  protected readonly values = [
    { n: '01', title: 'Honest materials', text: 'We use cane, rope and seasoned wood and we say so plainly.' },
    { n: '02', title: 'Patient craft', text: 'Handwork takes time. We never rush a weave to meet a number.' },
    { n: '03', title: 'Designed to be lived with', text: 'Comfort, proportion and simple lines come before decoration.' },
  ];
  protected readonly weave = photo('cane-handmade', 16);
  protected readonly mosaicChair = cut('cane-handmade', 3, 'peach');
  protected readonly mosaicLamp = cut('lamp', 13, 'sand');
  protected readonly artisans = [16, 17, 18, 19].map((n) => ({ art: photo('cane-handmade', n), pos: n }));
}
