import { Component, computed, signal } from '@angular/core';

interface Paso {
  id: number;
  titulo: string;
  detalle: string;
  comando?: string;
  hecho: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  secciones = [
    { id: 'resumen', titulo: 'Resumen' },
    { id: 'que-es', titulo: '¿Qué es?' },
    { id: 'versiones', titulo: 'Versiones afectadas' },
    { id: 'soluciones', titulo: 'Soluciones' },
    { id: 'twinteach', titulo: 'Checklist Twinteach' },
    { id: 'deteccion', titulo: '¿Me han atacado?' },
    { id: 'extra', titulo: 'Otros aspectos' },
  ];

  pasos = signal<Paso[]>([
    {
      id: 1,
      titulo: 'Localizar dónde se ejecuta el backend Laravel',
      detalle:
        'Identifica si corre en un VPS, hosting compartido, contenedor Docker o plataforma gestionada. De eso depende quién puede actualizar PHP (tú o el proveedor).',
      hecho: false,
    },
    {
      id: 2,
      titulo: 'Comprobar la versión de PHP del servidor',
      detalle:
        'Mira la versión instalada y compárala con la tabla de versiones seguras. En Docker, ejecútalo dentro del contenedor.',
      comando: 'php -v\ndocker exec NOMBRE_CONTENEDOR php -v',
      hecho: false,
    },
    {
      id: 3,
      titulo: 'Comprobar el PHP que usa realmente el servidor web',
      detalle:
        'El PHP de la consola puede ser distinto del que atiende las peticiones (PHP-FPM o Apache). Revisa también ese.',
      comando: 'ls /etc/php\nphp-fpm8.3 -v   # cambia 8.3 por tu versión',
      hecho: false,
    },
    {
      id: 4,
      titulo: 'Actualizar PHP y reiniciar el servicio',
      detalle:
        'Es la solución real. Si usas Docker, reconstruye la imagen descargando la base más reciente. Si el hosting es de un tercero, pídeles confirmación por escrito de que está parcheado.',
      comando:
        'sudo apt update && sudo apt upgrade\nsudo systemctl restart php8.3-fpm\n\n# Docker\ndocker build --pull --no-cache -t twinteach-api .',
      hecho: false,
    },
    {
      id: 5,
      titulo: 'Si no puedes actualizar ya: aplicar la mitigación',
      detalle:
        'Desactiva el progreso de subida de sesiones en la configuración del servidor (no con ini_set) y recarga PHP.',
      comando:
        'session.upload_progress.enabled = 0\n\nsudo php-fpm8.3 -t\nsudo systemctl reload php8.3-fpm',
      hecho: false,
    },
    {
      id: 6,
      titulo: 'Verificar que la configuración se aplicó',
      detalle:
        'Comprueba en el PHP del servidor web que el valor aparece desactivado. Debe salir Off.',
      comando: 'php-fpm8.3 -i | grep -E "upload_progress.enabled|fatal_error_backtraces"',
      hecho: false,
    },
    {
      id: 7,
      titulo: 'Revisar la parte Angular',
      detalle:
        'El frontend es JavaScript estático que se ejecuta en el navegador, así que PHP2Shell no le afecta directamente. Aun así, revisa sus dependencias y asegúrate de que no se sirve desde el mismo servidor PHP sin protección.',
      comando: 'npm audit',
      hecho: false,
    },
    {
      id: 8,
      titulo: 'Endurecer Laravel y el entorno',
      detalle:
        'Con APP_DEBUG desactivado no se filtran detalles internos. Limita los tamaños de subida y no expongas paneles de administración sin necesidad. Añade un WAF o reglas que bloqueen peticiones con el campo PHP_SESSION_UPLOAD_PROGRESS.',
      comando: 'APP_ENV=production\nAPP_DEBUG=false',
      hecho: false,
    },
    {
      id: 9,
      titulo: 'Buscar señales de explotación previa',
      detalle:
        'Antes del parche el servidor pudo ser atacado. Sigue la sección siguiente y conserva los logs.',
      hecho: false,
    },
  ]);

  hechos = computed(() => this.pasos().filter((p) => p.hecho).length);
  porcentaje = computed(() => Math.round((this.hechos() * 100) / this.pasos().length));

  alternar(indice: number) {
    this.pasos.update((lista) =>
      lista.map((p, i) => (i === indice ? { ...p, hecho: !p.hecho } : p))
    );
  }

  reiniciar() {
    this.pasos.update((lista) => lista.map((p) => ({ ...p, hecho: false })));
  }
}