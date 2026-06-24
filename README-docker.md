# Stremio Web en Docker 🐳

Esta guía te ayudará a levantar **Stremio Web** y el **Stremio Streaming Server** de manera local en contenedores Docker y asegurarte de que puedas reproducir y ver el contenido sin ningún tipo de problema de conexión, CORS o contenido mixto.

---

## 🛠️ Requisitos Previos

Ya hemos instalado Docker en tu servidor Fedora. Para poder ejecutar comandos de Docker sin tener que escribir `sudo` todo el tiempo, te sugerimos añadir tu usuario al grupo `docker`:

1. Agrega tu usuario al grupo:
   ```bash
   sudo usermod -aG docker $USER
   ```
2. Aplica los cambios de grupo de inmediato en tu terminal actual (o cierra sesión y vuelve a entrar):
   ```bash
   newgrp docker
   ```

---

## 🚀 Cómo Iniciar la Aplicación

Para construir la imagen de Stremio Web y levantar ambos contenedores (el cliente Web y el servidor de Streaming), ejecuta en la carpeta raíz del proyecto:

```bash
docker compose up -d --build
```
*(Si no has hecho el paso del grupo `docker` anterior, deberás anteponer `sudo`: `sudo docker compose up -d --build`)*

Esto iniciará:
*   **Stremio Web UI** en [http://localhost:8080](http://localhost:8080)
*   **Stremio Streaming Server** en el puerto `11470` (HTTP) y `12470` (HTTPS)

---

## 📺 Cómo Ver Contenido Sin Problemas

Stremio Web es una aplicación del lado del cliente (corre en tu navegador). Para reproducir torrents, enlaces magnet o vídeos, necesita comunicarse con un **Servidor de Streaming** (que es el encargado de descargar los torrents y convertirlos a streaming HTTP).

### Caso A: Si abres Stremio Web desde el mismo ordenador (Localhost)
1. Abre [http://localhost:8080](http://localhost:8080) en tu navegador.
2. Por defecto, Stremio Web intentará conectarse al servidor de streaming en `http://127.0.0.1:11470`. Como levantamos el servidor mapeando ese puerto al sistema local, se conectará automáticamente.
3. Ve a **Ajustes (Settings) -> Streaming** y comprueba que el estado del servidor de streaming aparezca como **Conectado / Online**.
4. ¡Listo! Puedes buscar tus películas, series o canales favoritos y reproducirlos.

### Caso B: Si accedes desde otro dispositivo en tu red local (TV, Móvil, Tablet, etc.)
Si abres Stremio Web desde otro dispositivo usando la IP de tu servidor Fedora (ej. `http://192.168.1.100:8080`):
1. **¡No necesitas hacer nada!** Hemos modificado el código para que el cliente detecte automáticamente la IP desde la que estás accediendo (`window.location.hostname`) y establezca el servidor de streaming por defecto a `http://192.168.1.100:11470/`.
2. El reproductor se conectará automáticamente al contenedor del servidor de streaming en tu Fedora y cargará los vídeos de inmediato.
3. Si por alguna razón deseas usar un servidor de streaming externo o diferente, siempre puedes cambiarlo manualmente en **Ajustes (Settings) -> Streaming -> Dirección del Servidor de Streaming**.

---

## 📝 Comandos Útiles

*   **Ver logs de los contenedores:**
    ```bash
    docker compose logs -f
    ```
*   **Detener la aplicación:**
    ```bash
    docker compose down
    ```
*   **Reiniciar la aplicación:**
    ```bash
    docker compose restart
    ```
