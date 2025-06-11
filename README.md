# TibberToShellyLiveTariffv2
Send Tibber prices to Shelly Live Tariff

----------------

Dieses Skript ermöglicht die Nutzung der Live-Tarif-Funktion von Shelly via Tibber (Anbieter dynamischer Stromtarife). Es prüft minütlich, ob eine neue Viertelstunde angebrochen ist, ruft dann den aktuellen Börsenstrompreis ab und sendet ihn an euren Shelly-Account. Dadurch können die Stromkosten eurer einzelnen Shelly-Geräte exakt berechnet werden. Da der Abruf bei Tibber nicht immer erfolgreich ist, habe ich ein Try-Catch eingebaut.

Genutzte Quellen: https://community.shelly.cloud/topic/8131-live-stromtarife-in-der-shelly-app/
