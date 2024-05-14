package com.example.demo.controller;

import com.example.demo.entity.ChargerInfo;
import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
@RestController
public class ChargerInfoDisplayer {

    @CrossOrigin(origins = "*")
    @GetMapping("/saludo")
    public ArrayList<ChargerInfo> holaMundo(@RequestParam double latitudOrigen, @RequestParam double longitudOrigen, @RequestParam double latitudDestino, @RequestParam double longitudDestino) {
        String url = "https://api.openchargemap.io/v3/poi/?client=ocm.app.ionic.8.6.1&verbose=false&output=json&includecomments=true&maxresults=40&compact=true&boundingbox=(" + latitudOrigen + "," + longitudOrigen + "),(" + latitudDestino + "," + longitudDestino + ")&key=53f3079e-75c6-40eb-bc30-8b8792c9602f";
        WebClient.Builder builder = WebClient.builder();
        String response = builder.build().get().uri(url)
                .retrieve().bodyToMono(String.class)
                .block();
        ArrayList<ChargerInfo> listaEstaciones;
        listaEstaciones = obtenerDatos(response);
        String datos = "";
        for (ChargerInfo miEstacion : listaEstaciones) {
            datos += miEstacion;
        }
        return listaEstaciones;
    }

    public static ArrayList<ChargerInfo> obtenerDatos(String stringJson) {
        JSONObject objeto = null;
        String nombre = "";
        String direccion = "";
        String poblacion = "";
        String codigoPostal = "";
        String comunidad = "";
        String precio = "";
        double latitud = 0;
        double longitud = 0;
        ArrayList<ChargerInfo> listaEstaciones = new ArrayList<ChargerInfo>();

        JSONArray ArrayJson = new JSONArray(stringJson);
        for (int i = 0; i < ArrayJson.length(); i++) {

            try {
                objeto = ArrayJson.getJSONObject(i);
                System.out.println(objeto);
                nombre = objeto.getJSONObject("AddressInfo").getString("Title");
                direccion = objeto.getJSONObject("AddressInfo").getString("AddressLine1");
                poblacion = objeto.getJSONObject("AddressInfo").getString("Town");
                codigoPostal = objeto.getJSONObject("AddressInfo").getString("Postcode");
                comunidad = objeto.getJSONObject("AddressInfo").getString("StateOrProvince");
                precio = objeto.getString("UsageCost");
                latitud = objeto.getJSONObject("AddressInfo").getDouble("Latitude");
                longitud = objeto.getJSONObject("AddressInfo").getDouble("Longitude");
            } catch (JSONException e) {

            }
            ChargerInfo miEstacion = new ChargerInfo(nombre, direccion, poblacion, codigoPostal, comunidad, precio, latitud, longitud);
            listaEstaciones.add(miEstacion);
        }
        return listaEstaciones;
    }
}
