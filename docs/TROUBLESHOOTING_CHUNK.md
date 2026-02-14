# ChunkLoadError: Loading chunk app/layout failed (timeout)

## Causa habitual

- Caché de Next (`.next`) dañada o lenta.
- **OneDrive**: si el proyecto está en una carpeta sincronizada (ej. Escritorio), la carpeta `.next` tiene miles de archivos y la sincronización puede hacer que las lecturas sean muy lentas y se agote el tiempo de carga del chunk.

## Solución 1: Limpiar y reiniciar

En la raíz del proyecto:

```bash
# Borrar caché
rm -rf .next
# o en PowerShell:
Remove-Item -Recurse -Force .next

# Arrancar de nuevo
npm run dev
```

Abre de nuevo `http://localhost:3000`. La primera carga puede tardar más mientras recompila.

## Solución 2: Si sigue fallando (proyecto en OneDrive)

1. **Mover el proyecto** a una carpeta que no sincronice OneDrive, por ejemplo:
   - `C:\dev\novia-web`
   - Luego: `cd C:\dev\novia-web` y `npm run dev`.

2. **O excluir `.next` de OneDrive** (OneDrive puede seguir indexando):
   - Clic derecho en la carpeta del proyecto → "Liberar espacio" / "Always keep on this device" según tu versión, para evitar que OneDrive bloquee archivos mientras trabajás.

## Solución 3: Antivirus

Si tenés antivirus que escanea en tiempo real, probá añadir una excepción para la carpeta del proyecto o para `.next`, para descartar que esté retrasando la lectura de los chunks.
