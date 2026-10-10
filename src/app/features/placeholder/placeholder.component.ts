import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LucideConstruction as Construction, LucideSparkles as Sparkles } from '@lucide/angular';

@Component({
  selector: 'app-placeholder', standalone: true, imports: [CommonModule, Construction, Sparkles],
  template: `<section class="placeholder"><div class="placeholder-icon"><svg lucideConstruction [size]="28"></svg></div><span class="kicker">Módulo SIGEV</span><h1>{{ title }}</h1><p>{{ description }}</p><div class="coming"><svg lucideSparkles [size]="16"></svg>Este espacio ya tiene su ruta preparada para la siguiente fase de desarrollo.</div></section>`,
  styles: [`.placeholder{min-height:420px;display:grid;place-content:center;justify-items:center;padding:30px;border:1px dashed #cbdde4;border-radius:16px;background:#fbfdfe;text-align:center}.placeholder-icon{display:grid;place-items:center;width:62px;height:62px;margin-bottom:18px;border-radius:18px;background:#e8f5f7;color:#237c8b}.kicker{color:#257e8d;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.placeholder h1{margin:12px 0 8px;color:#1d3853;font-size:28px;letter-spacing:-.04em}.placeholder p{max-width:430px;margin:0;color:#788b9d;font-size:13px;line-height:1.7}.coming{display:flex;align-items:center;gap:8px;margin-top:22px;padding:11px 13px;border-radius:9px;background:#f0f8f8;color:#54818a;font-size:11px}.coming lucide-sparkles{color:#ca9c2f}`],
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly title = this.route.snapshot.data['title'] as string;
  protected readonly description = this.route.snapshot.data['description'] as string;
}
