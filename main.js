let apiUrl = "https://api.tibber.com/v1-beta/gql";
let token = "xxx";
	// Hier euren Tibber-Token einsetzen
let query = JSON.stringify({
  query: '{ viewer { homes { currentSubscription { priceInfo { current { total }}}}}}'
});
let shellyCloudUrl = "xxx";
	// Die URL sieht grob so aus: https://shelly-NN-eu.shelly.cloud/v2/user/pp-ltu/xxx
let shellyVar = "current_price";
	// Variable zur lokalen Speicherung des Preises

function fetchTibberPrice() 
{
  Shelly.call("HTTP.REQUEST", 
    {
      method: "POST",
      url: apiUrl,
      headers: 
      {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: query
    }, 
    function (res, err) 
    {
      if (err) 
      {
        print("Fehler beim Abrufen: ", JSON.stringify(err));
        return;
      }

      try 
      {
        let response = JSON.parse(res.body);
        let currentPrice = response.data.viewer.homes[0].currentSubscription.priceInfo.current.total;

        // Preis lokal speichern
        Shelly.call("KVS.Set", 
          {
            key: shellyVar, value: response
          }
        );

        // Preis an Shelly Cloud senden
        let jsonPayload = JSON.stringify({ price: currentPrice.toFixed(4) });
        print("Strompreis aktuell: ", currentPrice, " €/kWh");

        Shelly.call("HTTP.REQUEST", 
          {
            method: "POST",
            url: shellyCloudUrl,
            headers: 
            {
              "Content-Type": "application/json"
            },
            body: jsonPayload
          },
          function (cloudRes, cloudErr) 
          {
            if (cloudErr) 
            {
              print("Fehler beim Senden an Shelly Cloud: ", JSON.stringify(cloudErr));
            }
            else 
            {
              print("Brutto-Preis erfolgreich an Shelly Cloud gesendet!");
            }
          }
        );
      } 
      catch (e) 
      {
        print("Fehler beim Verarbeiten der Antwort: ", JSON.stringify(e));
      }
    }   
  );
}

// Skript beim Start ausführen und dann entsprechend aktualisieren
fetchTibberPrice();
// Zeit im ms 1x pro Stunde = 3600000
// alle fünf Minuten = 300000
Timer.set(60000, true, function ()
  {
    let now = new Date();
    let minute = now.getMinutes();
    //let minute = 0;
    //let second = now.getSeconds();
    //let second = 4;
    //print(minutes, seconds);
    // Nur zur vollen Stunde (Minuten und Sekunden = 0)
    //if (minutes % 15 === 0 && seconds < 10)
    if (minute % 15 === 0)
      {
        fetchTibberPrice();
      }      
    function pad(num)
    {
      return (num < 10 ? "0" : "") + num;
    }
    let hourStr = pad(now.getHours());
    let minuteStr = pad(now.getMinutes());
    let secondStr = pad(now.getSeconds());
    let timeStr = hourStr + ":" + minuteStr + ":" + secondStr;
    print("Timer ausgeführt um ", timeStr);
  }, null
);
