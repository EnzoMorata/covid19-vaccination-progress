const WorldMap = {
    WIDTH: 450,
    HEIGHT: 320,
};

const svgMapa = d3.select("#WorldMap")
              .attr("height", WorldMap.HEIGHT)
              .attr("width", WorldMap.WIDTH);
svgMapa.append("rect")
   .attr("height", WorldMap.HEIGHT)
   .attr("width", WorldMap.WIDTH)
   .attr("fill", "lightgray")
              
const contenedorMapa = svgMapa.append("g");
const paisActual = d3.select("#paisActual");
const continenteActual = d3.select("#continenteActual");

const tooltip = svgMapa.append("text").attr("font-family", "Verdana").attr("font-size", 13);

let proyeccion = "";
let scaleNormal = "";
let translateNormal = "";  

const vacunacionDiariaPais = {
    WIDTH: 450,
    HEIGHT: 320
}

const marginPais = {
    top: 70,
    left: 100,
    right: 10,
    bottom: 70
}

const svgPais = d3.select("#paisSeleccionado")
                  .attr("height", vacunacionDiariaPais.HEIGHT)
                  .attr("width", vacunacionDiariaPais.WIDTH)

const contenedorLineas = svgPais.append("g")
                                .attr("transform", `translate(${marginPais.left},${marginPais.top})`);

const ejeXLineas = svgPais.append("g").attr("transform", `translate(${marginPais.left},${vacunacionDiariaPais.HEIGHT - marginPais.bottom})`);
const ejeYLineas = svgPais.append("g").attr("transform", `translate(${marginPais.left},${marginPais.top})`);

const tituloVacunacionDiaria = svgPais.append("text")
                                .attr("transform", `translate(${vacunacionDiariaPais.WIDTH/2}, ${marginPais.top/2})`)
                                .attr("text-anchor", "middle")
                                .attr("font-family", "Verdana")
                                .attr("font-size", 14)

const tituloEjeXDiaria = svgPais.append("text")
                                .attr("transform", `translate(${(vacunacionDiariaPais.WIDTH - marginPais.left - marginPais.right)/2 + marginPais.left}, ${vacunacionDiariaPais.HEIGHT - marginPais.bottom * 1/2})`)
                                .attr("text-anchor", "middle")
                                .attr("font-family", "Verdana")
                                .attr("font-size", 12)

const tituloEjeYDiaria = svgPais.append("text")
                                .attr('transform', `rotate(-90) translate(${-(marginPais.top + (vacunacionDiariaPais.HEIGHT - marginPais.top - marginPais.bottom) / 2)}, ${(marginPais.left * 1/3)})`)
                                .attr("text-anchor", "middle")
                                .attr("font-family", "Verdana")
                                .attr("font-size", 12)

const vacunacion100Pais = {
    WIDTH: 520,
    HEIGHT: 320
};

const margin100Pais = {
    top: 70,
    left: 50,
    bottom: 70,
    right: 70
};

const escalaColor = d3.scaleOrdinal(d3.schemeSet1);

const svg100Pais = d3.select("#vacunacion100")
                     .attr("height", vacunacion100Pais.HEIGHT)
                     .attr("width", vacunacion100Pais.WIDTH);

const contenedorLeyenda = svg100Pais.append("g")
                                    .attr("transform", `translate(${vacunacion100Pais.WIDTH - margin100Pais.right - 66}, ${margin100Pais.top})`)

const contenedorAreasApiladas = svg100Pais.append("g")
                                          .attr("transform", `translate(${margin100Pais.left},${margin100Pais.top})`);

const ejeXAreas = svg100Pais.append("g").attr("transform", `translate(${margin100Pais.left},${vacunacion100Pais.HEIGHT - margin100Pais.bottom})`);
const ejeYAreas = svg100Pais.append("g").attr("transform", `translate(${margin100Pais.left},${ margin100Pais.top})`);

const tituloVacunacion100 = svg100Pais.append("text")
                                .attr("transform", `translate(${vacunacion100Pais.WIDTH/2}, ${margin100Pais.top/2})`)
                                .attr("text-anchor", "middle")
                                .attr("font-family", "Verdana")
                                .attr("font-size", 14)

const tituloEjeX100 = svg100Pais.append("text")
                                .attr("transform", `translate(${(vacunacion100Pais.WIDTH - margin100Pais.left - margin100Pais.right)/2 + margin100Pais.left}, ${vacunacion100Pais.HEIGHT - margin100Pais.bottom * 1/2})`)
                                .attr("text-anchor", "middle")
                                .attr("font-family", "Verdana")
                                .attr("font-size", 12)

const tituloEjeY100 = svg100Pais.append("text")
                                .attr('transform', `rotate(-90) translate(${-(margin100Pais.top + (vacunacion100Pais.HEIGHT - margin100Pais.top - margin100Pais.bottom) / 2)}, ${(margin100Pais.left * 1/3)})`)
                                .attr("text-anchor", "middle")
                                .attr("font-family", "Verdana")
                                .attr("font-size", 12)

const resumenPoblacion = d3.select("#resumen_poblacion");
const resumenVacunacion = d3.select("#resumen_vacunacion");
const resumenPorcentajeVacunacion= d3.select("#resumen_porcentaje_vacunacion"); 
const resumenVacunacionTotal = d3.select("#resumen_vacunacion_total");
const resumenPorcentajeVacunacionTotal = d3.select("#resumen_porcentaje_vacunacion_total"); 

let seleccionandoPais = "";

const graficarPais = (datosPais) => {  
    const escalaLineasX = d3.scaleTime()
                      .domain([new Date(datosPais[0].fecha), new Date(datosPais[datosPais.length - 1].fecha)])
                      .range([0, vacunacionDiariaPais.WIDTH - marginPais.left - marginPais.right]);

    const escalaLineasY = d3.scaleLinear()
                      .domain([0, d3.max(datosPais.map((d) => d.vacunacionDiaria))])
                      .range([vacunacionDiariaPais.HEIGHT - marginPais.top - marginPais.bottom, 0])
                      .nice();

    const definirLineas = d3.line()
                            .curve(d3.curveMonotoneX)
                            .x((d) => escalaLineasX(new Date(d.fecha)))
                            .y((d) => escalaLineasY(d.vacunacionDiaria));

    ejeXLineas.call(d3.axisBottom(escalaLineasX));
    ejeYLineas.call(d3.axisLeft(escalaLineasY))
              .selectAll("line")
              .attr("x1", vacunacionDiariaPais.WIDTH - marginPais.left - marginPais.right)
              .attr("stroke-dasharray", "5")
              .attr("opacity", 0.5);

    tituloVacunacionDiaria.text("Vacunación diaria")
    tituloEjeXDiaria.text("Fechas")
    tituloEjeYDiaria.text("Cantidad de vacunación")

    contenedorLineas.selectAll("path")
                    .data(datosPais)
                    .join(
                        (enter) => {
                            enter.append("path")
                                 .attr("fill", "transparent")
                                 .attr("stroke", escalaColor())
                                 .attr("d", definirLineas(datosPais))
                                 .attr("stroke-width", 1.4)                      
                        },
                        (update) => {
                            update.attr("d", definirLineas(datosPais))
                        },
                        (exit) => {
                            exit.remove()
                        }
                    )
                    
    const lista = [[],[],[]]
    let vacunacion100 = datosPais.filter((d) => d.vacunacion100 != 0)          
    vacunacion100 = vacunacion100.map((d) => {
        lista[0].push({
            valor: d.vacunacion100,
            fecha: d.fecha
        })
        lista[1].push(
            {
                valor: 100 - d.vacunacion100,
                fecha: d.fecha
            }

        )
        lista[2].push(
            {
                valor: d.vacunacionTotal100,
                fecha: d.fecha
            }
        )
    });
    
    const escalaAreaX = d3.scaleTime()
                          .domain([new Date(lista[0][0].fecha), new Date(lista[0][lista[0].length - 1].fecha)])
                          .range([0, vacunacionDiariaPais.WIDTH - margin100Pais.left - margin100Pais.right]);

    const escalaAreaY = d3.scaleLinear()
                      .domain([0, 100])
                      .range([vacunacion100Pais.HEIGHT - margin100Pais.top - margin100Pais.bottom, 0]);

    const definirArea = d3.line()
                           .curve(d3.curveMonotoneX)
                           .x((d) => escalaAreaX(new Date(d.fecha)))
                           .y((d) => escalaAreaY(d.valor));

    ejeXAreas.call(d3.axisBottom(escalaAreaX));
    ejeYAreas.call(d3.axisLeft(escalaAreaY))
             .selectAll("line")
             .attr("x1", vacunacion100Pais.WIDTH - margin100Pais.left - margin100Pais.right - 70)
             .attr("stroke-dasharray", "5")
             .attr("opacity", 0.5);

    tituloVacunacion100.text("Porcentaje de población vacunada");
    tituloEjeX100.text("Fechas")
    tituloEjeY100.text("Porcentaje")

    const colores = [];
    for (let i = 0; i < 3; i++) {
        colores.push(escalaColor(i))
    }
   
    contenedorAreasApiladas.selectAll("path")
                           .data(lista)
                           .join("path")
                           .attr("d", (d, i) => definirArea(d))
                           .attr("stroke", (_, i) => colores[i])
                           .attr("opacity", 1)
                           .attr("fill", "transparent")
                           .attr("stroke-width", 2)

    contenedorLeyenda.selectAll("rect")
                     .data(lista)
                     .enter()
                     .append("rect")
                     .attr("x", 0)
                     .attr("y", (_, i) => 30 * i)
                     .attr("height", 10)
                     .attr("width", 10)
                     .attr("fill", (_, i) => colores[i])

    const nombresLeyenda = ["Vacunada", "No vacunada", "Totalmente vacunada"]
    contenedorLeyenda.selectAll("text")
                     .data(lista)
                     .enter()
                     .append("text")
                     .attr("text-anchor", "start")
                     .attr("x", 15)
                     .attr("y", (_, i) => 30 * i)
                     .text((_, i) => nombresLeyenda[i])
                     .attr("dy", 8)
                     .attr("font-size", 11)
                     .attr("font-family", "Verdana")
}

const resumirPais = (datosPais, poblacion) => {
    const ultimoDato = datosPais[datosPais.length - 1]
    resumenPoblacion.text(poblacion.toLocaleString())
    resumenVacunacion.text(ultimoDato.numero_vacunacion.toLocaleString())
    resumenPorcentajeVacunacion.text(ultimoDato.vacunacion100 + "%")
    resumenVacunacionTotal.text(ultimoDato.numero_vacunacion_total.toLocaleString())
    resumenPorcentajeVacunacionTotal.text(ultimoDato.vacunacionTotal100 + "%")
};

const graficarGeo = (datosGeo, datosPaises) => {
    const caminosGeo = d3.geoPath().projection(proyeccion);
    contenedorMapa
                  .selectAll("path")
                  .data(datosGeo.features, (d) => d.properties.iso_a3)
                  .enter()
                  .append("path")
                  .attr("d", caminosGeo)
                  .attr("stroke", "steelblue")
                  .attr("fill", "white")
                  .on("mouseenter", (evento) => {
                    evento.target.setAttribute("fill", "steelblue");
                    evento.target.setAttribute("opacity", 0.5);
                    tooltip.text(evento.target.__data__.properties.admin)  
                           .attr("text-anchor", "start")
                           .attr("x", 0)
                           .attr("y", 0)
                           .attr("dy", 14)
                           .attr("dx", 4)                    
                  })
                  .on("mouseleave", (evento) => {
                    if (seleccionandoPais != evento.target.__data__.properties.iso_a3) {
                        evento.target.setAttribute("fill", "white");
                        evento.target.setAttribute("opacity", 1);
                    } else if (seleccionandoPais == evento.target.__data__.properties.iso_a3) {
                        evento.target.setAttribute("fill", "steelblue")
                        evento.target.setAttribute("opacity", 1) 
                    }
                    tooltip.text("")
                    
                  })
                  .on("click", (evento) => {
                    contenedorMapa.selectAll("path").attr("fill", "white");
                    evento.target.setAttribute("fill", "steelblue")
                    evento.target.setAttribute("opacity", 1)
                    seleccionandoPais = evento.target.__data__.properties.iso_a3
                    paisActual.text("País actual: " + evento.target.__data__.properties.admin)
                    continenteActual.text("Continente actual: " + evento.target.__data__.properties.continent)
                    const pais = datosPaises.filter((d) => d.iso_code == evento.target.__data__.properties.iso_a3) 
                    const poblacion = evento.target.__data__.properties.pop_est 
                    if (pais.length != 0) {
                        const datosPais = pais.map((d) => {
                            const objetoDato = {
                                iso_code: d.iso_code,
                                fecha: d.date,
                                vacunacionDiaria: d.daily_vaccinations == "" ? 0 : parseInt(d.daily_vaccinations),
                                vacunacion100: d.people_vaccinated_per_hundred == "" ? 0 : parseFloat(d.people_vaccinated_per_hundred),
                                vacunacionTotal100: d.people_fully_vaccinated_per_hundred == "" ? 0 : parseFloat(d.people_fully_vaccinated_per_hundred),
                                numero_vacunacion:  d.people_vaccinated == "" ? 0 : parseInt(d.people_vaccinated),
                                numero_vacunacion_total: d.people_fully_vaccinated == "" ? 0 : parseInt(d.people_fully_vaccinated)
                            }
                        return objetoDato
                        });
                        graficarPais(datosPais)
                        resumirPais(datosPais, poblacion)
                    } else {
                        contenedorAreasApiladas.selectAll("path").remove();
                        contenedorLineas.selectAll("path").remove();
                        resumenPoblacion.text("")
                        resumenPorcentajeVacunacion.text("")
                        resumenPorcentajeVacunacionTotal.text("")
                        resumenVacunacion.text("")
                        resumenVacunacionTotal.text("")

                    }
                    
                  });
};

const manejadorZoom = (evento) => {
    const transformacion = evento.transform;
    const scaleNuevo = transformacion.k;
    const translateNuevo = [transformacion.x, transformacion.y];
    proyeccion = d3.geoMercator()
                   .translate([translateNormal[0] * scaleNuevo + translateNuevo[0], translateNormal[1] * scaleNuevo + translateNuevo[1]])
                   .scale(scaleNormal * scaleNuevo);
    caminosGeo = d3.geoPath().projection(proyeccion);
    contenedorMapa.selectAll("path")
                  .attr("d", caminosGeo);
};

const zoom = d3.zoom()
               .extent([
                   [0, 0],
                   [WorldMap.WIDTH, WorldMap.HEIGHT]
               ])
               .translateExtent([
                   [0, 0],
                   [WorldMap.WIDTH, WorldMap.HEIGHT]
               ])
               .scaleExtent([1, 10])
               .on("zoom", manejadorZoom)
svgMapa.call(zoom)

d3.json("Data/custom.geo.json").then((datosGeo) => {
    d3.csv("Data/country vaccinations.csv").then((datosPaises) => {
        proyeccion = d3.geoMercator().fitSize([WorldMap.WIDTH, WorldMap.HEIGHT], datosGeo);
        scaleNormal = proyeccion.scale();
        translateNormal = proyeccion.translate();
        graficarGeo(datosGeo, datosPaises);
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));

                          