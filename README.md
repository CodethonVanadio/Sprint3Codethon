##BackEnd## 
- La creación de la parte del backend ha sido realizada mediante spring boot en la versión 17 de java, por tanto para poder desplegar la aplicación es necesario seguir estos pasos

1. Instalación del JDK 17 de Nellsoft.
2. Instalación del NetBeans 17.
3. En NetBeans, ir a la pestaña Tools/Plugins. Se abrirá una ventana, dirigirse a la pestaña Downloaded/Add Plugins.
4. Buscar y seleccionar el nb-springboot-plugin.
5. Presionar el botón "Install" en la esquina inferior izquierda, seguir los pasos y reiniciar el IDE.
Cuando abras de nuevo NetBeans, podrás ver que en nuevo proyecto/Maven/new spring app.

El programa utiliza el puerto 8989, por lo que si quieres probar a hacer llamadas en local tendás que utilizar ese puerto
A la hora de abrir el proyecto, es posible que salga como [unloadable]  o no cargue correctamente, para solucionar este problema , botón derecho sobre el proyecto, clean and build.

La función principal de la aplicacion del backend es devolver la información extraída  de la API de https://openchargemap.org/site, filtrar y ordenar toda esa información para sacar solo los datos que nos interesan y devolver la información dependiendo de los parámtetros de latitud y longitud tanto de origen como de destino mediante una solicitud http que envía el front para comunicarse.
Como segunda funcionalidad que hemos implementado ha sido desarrollar nuestra propia APIrest de forma que, con ella se puedan realizar las acciones CRUD,implementando una base de datos, de forma que, si en algún momento decidiésemos hacer un login funcional, nos costara mucho menos trabajo crearlo todo. 

Para esta base de datos, también están implementados los servicios de validación de parámetros con control de excepciones para no recibir parámtros incorrectos o nulos, búsqueda por similitud y consultas personalizadas
El proyecto además está estructurado de forma que servicios ,entidades y métodos estén separados en paquetes, de manera que, su escalabilidad , su flexibilidad y su resiliencia a fallos son mucho mayores que con una estructura de proyecto común.
Por úñtimo explicar un par de cosas que me gustaría haber implementado a tiempo:
Me gustaría haber implemetado en mi proyecto una la base de datos de PostgreSQL para ello (pero me daba unos errores a la hora de subirlo a render que no se solucionar por el momento) y también implementar usos de la capa de acceso a datos.

##FrontEnd##

Por la parte de Front, la cuál ha sido desarrollada con Angular, tenemos tanto cada uno de los componentes visuales e interactivos de nuestra aplicación como las funcionalidades de cada uno de estos. También hemos creado un servicio de autenticación el cuál se corresponde con el login. Además de eso hemos implementado la API de OpenStreetMap tanto para la generación del mapa como para generar las rutas en este dependiendo de las ubicaciones que introduzca el usuario. Las ubicaciones que introduzca el usuario serán buscadas a través de una comunicación vía HTTP con la API llamada Nominatim de OpenStreetMap a partir de la cual se generarán varias opciones que coincidan con dicha ubicación y al seleccionar una se añadirá como parada. 
Una vez se hayan seleccionado las paradas, al darle al botón “Generar ruta”, tal y como lo indica su nombre, se generará la ruta la cual iniciará desde tu ubicación actual hasta la última parada que se haya introducido, pasando a través de cada una de las paradas en orden de selección. A lo largo de la ruta generada se instanciarán los cargadores eléctricos próximos a esta. Toda la información de cada uno de estos cargadores es recibida y filtrada en el Backend, además del propio hecho de que los cargadores que se muestren sean solo aquellos que estén próximos a la ruta.

VERSIÓN DE ANGULAR
Esté proyecto ha sido generado con Angular CLI, versión 17.3.2.
INSTALACIÓN
Clona el repositorio o descarga el código directamente.
Navega hasta la ubicación donde lo hayas guardado y ábrelo.
Instala las dependencias usando el comando ‘npm install’ en la consola.
LEVANTAR EL SERVIDOR
Para poder visualizar correctamente la aplicación web se deberá levantar el servidor introduciendo el comando ‘ng serve’ en la consola.
Navegar a http://localhost:4200/en el navegador de preferencia. La aplicación se recargará automáticamente cada vez que se realice algún cambio.
También puede introducir el comando ‘ng serve -o’ para que lo abra directamente en el navegador que haya elegido por defecto.
