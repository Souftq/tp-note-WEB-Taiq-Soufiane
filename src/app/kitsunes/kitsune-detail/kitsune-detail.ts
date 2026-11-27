import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GestionKitsunes } from '../gestion-kitsunes';
import { KitsuneIntrouvable } from '../kitsune-introuvable/kitsune-introuvable';

const ESSAIS_MAX = 3;

@Component({
  selector: 'app-kitsune-detail',
  imports: [RouterLink, KitsuneIntrouvable],
  templateUrl: './kitsune-detail.html',
  styleUrl: './kitsune-detail.scss',
})
export class KitsuneDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly gestionKitsunes = inject(GestionKitsunes);

  private readonly nom = signal('');
  protected readonly kitsune = computed(() => this.gestionKitsunes.trouver(this.nom()));

  protected readonly essaisRates = signal(0);
  protected readonly essaisMax = ESSAIS_MAX;

  // Bloqué si déjà boosté ou après 3 échecs de suite
  protected readonly boostBloque = computed(
    () => this.kitsune()?.boost === true || this.essaisRates() >= ESSAIS_MAX,
  );

  ngOnInit(): void {
    // subscribe plutôt que snapshot pour suivre les changements de :nom
    this.route.paramMap.subscribe((params) => {
      this.nom.set(params.get('nom') ?? '');
      this.essaisRates.set(0);
    });
  }

  protected tenterBoost(): void {
    const kitsune = this.kitsune();
    if (!kitsune) {
      return;
    }
    // On prend le vrai nom, celui de l'URL peut être en minuscules
    const reussi = this.gestionKitsunes.tenterBoost(kitsune.nom);
    if (!reussi) {
      this.essaisRates.update((essais) => essais + 1);
    }
  }
}
