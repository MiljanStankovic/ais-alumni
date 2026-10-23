# AIESEC Alumni platforma: prototip

Statički, klikabilni prototip, koji radi na računaru, tabletu i telefonu.
Svi podaci su izmišljeni. Stanje se čuva samo dok je stranica otvorena.

## Objavljivanje na Netlify

1. Otvori https://app.netlify.com/drop i prijavi se besplatnim nalogom.
2. Prevuci ceo ovaj folder (ili .zip) u prozor.
3. Za par sekundi dobijaš link; u Site settings > Change site name možeš da ga preimenuješ, npr. `aiesec-alumni-prototip`.

## Ekrani

| Link | Ekran | Iz ugla |
|---|---|---|
| `#/pregled` | Pregled zajednice | MCP |
| `#/prijava` | Javna prijava alumnija | Posetilac |
| `#/prijave` | Odobravanje prijava | LCP Novi Sad |
| `#/baza` | Alumni baza | MCP |
| `#/profil` | Profil alumnija iz drugog LC-a, zahtev za kontakt | LCP FON |
| `#/kontakt` | Zahtevi za kontakt | LCP Novi Sad |
| `#/newsletter` | Novi newsletter | LCP Novi Sad |
| `#/grupe` | Grupe (otvorene i zatvorene) | LCP Novi Sad |
| `#/uloge` | Uloge, pristup, uslovi po LC-u | MCP |
| `#/moje-grupe` | Grupe iz ugla alumnija | Alumni |

Raspored: računar ima bočni meni, tablet uski meni sa ikonama, telefon donju navigaciju i meni „Više”.

## Struktura repozitorijuma

- `index.html`, `assets/`: statički sajt (ovo objavljuje Netlify)
- `design/`: izvorni ekrani iz Claude Design platna (`.dc.html`), za referencu
- `netlify.toml`: Netlify objavljuje koren repozitorijuma, bez build koraka

Za automatsko objavljivanje: na Netlify-ju izaberi Add new site → Import an existing project → GitHub → `ais-alumni`. Svaki push na `main` tada se sam objavi.
