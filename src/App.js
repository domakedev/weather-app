import { useEffect, useState } from "react";

import "./App.css";
import { ReactComponent as Precip } from "./images/icon-precipitation.svg";
import { ReactComponent as LowTemp } from "./images/icon-low.svg";

// Climas
import { ReactComponent as Sunny } from "./images/sunny.svg";
import { ReactComponent as Stormy } from "./images/stormy.svg";
import { ReactComponent as Snowy } from "./images/snowy.svg";
import { ReactComponent as Rainy } from "./images/rainy.svg";
import { ReactComponent as PartlyCloudy } from "./images/partly-cloudy.svg";
import { ReactComponent as Cloudy } from "./images/cloudy.svg";

import FakeJsonDias from "./daily.json";

const FakeData = FakeJsonDias;

console.log(FakeData);

function App() {
  const [dias, setDias] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.weatherbit.io/v2.0/forecast/daily?city=cajamarca,pe&key=968115b116e54e1f961a6dbc2259d85f"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);

        // Agregar exactDay a cada elemento
        const setExactDay = data.data.map((e) => {
          const fecha = new Date(e.datetime + " ");
          e.exactDay = fecha.toString().slice(0, 3);
          return e;
        });

        // Eliminar primer dia por si es Lunes
        setExactDay.shift();

        // Obtener indice del siguiente Lunes, de la sgt semana
        const indexOfMon = setExactDay
          .map(function (e) {
            return e.exactDay;
          })
          .indexOf("Mon");

        console.log("Exact index of Mon", indexOfMon);

        // Crear array de dias de la sgt semana unicamente:
        const nextWeekDaysIDs = [];
        for (let i = 0; i < 7; i++) {
          nextWeekDaysIDs.push(i + indexOfMon);
        }
        console.log(nextWeekDaysIDs);

        // Crear array con los elementos solo de los dias de la sgt semana
        const nextWeekDays = setExactDay.filter((e) =>
          nextWeekDaysIDs.includes(setExactDay.indexOf(e))
        );
        console.log("siguiente semana e:", nextWeekDays);

        setExactDay.forEach((element) => {
          console.log(element.weather.code);
        });

        setDias(nextWeekDays);
      });
  }, []);

  const defineWeatherClass = (e) => {
    let wcname = "";
    switch (Number(e.weather.code)) {
      case 500 || 501 || 502 || 511 || 520 | 521 || 522:
        wcname = "rainy";
        break;

      case 500:
      case 501:
      case 502:
      case 511:
      case 520:
      case 521:
      case 522:
        wcname = "rainy";
        break;

      case 803:
      case 804:
        wcname = "cloudy";
        break;

      case 801:
      case 802:
        wcname = "partly-cloudy";
        break;

      case 200:
      case 201:
      case 202:
      case 230:
      case 231:
      case 232:
      case 233:
        wcname = "stormy";
        break;

      case 600:
      case 601:
      case 602:
      case 610:
      case 621:
      case 622:
        wcname = "snowy";
        break;

      case 800:
        wcname = "sunny";
        break;

      default:
        break;
    }
    return wcname;
  };

  const defineWeatherImage = (e) => {
    let image;
    switch (e.weather.code) {
      case 500:
      case 501:
      case 502:
      case 511:
      case 520:
      case 521:
      case 522:
        image = <Rainy></Rainy>;
        break;

      case 803:
      case 804:
        image = <Cloudy></Cloudy>;
        break;

      case 801:
      case 802:
        image = <PartlyCloudy></PartlyCloudy>;
        break;

      case 200:
      case 201:
      case 202:
      case 230:
      case 231:
      case 232:
      case 233:
        image = <Stormy></Stormy>;
        break;

      case 600:
      case 601:
      case 602:
      case 610:
      case 621:
      case 622:
        image = <Snowy></Snowy>;
        break;

      case 800:
        image = <Sunny></Sunny>;
        break;

      default:
        break;
    }

    return image;
  };

  return (
    <div className="wrapper">
      {dias.map((e, i) => (
        <div className="day" key={i}>
          <div className="day-of-week">
            {new Date(e.datetime + " ").toString().slice(0, 3)}
          </div>
          <div className="date">
            {new Date(e.datetime + " ").getDate().toLocaleString()}
          </div>

          <div className={`bar ${defineWeatherClass(e)}`}>
            <div className="weather">{defineWeatherImage(e)}</div>
            <div className="temperature">
              {Number(e.max_temp).toFixed()}
              <span className="degrees">&deg;</span>
            </div>
            <div className="content">
              <div className="box precipitation">
                <Precip></Precip>
                <p>{e.precip.toFixed()}%</p>
              </div>
              <div className="box low">
                <LowTemp></LowTemp>
                <p>{e.min_temp.toFixed()}&deg;</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
