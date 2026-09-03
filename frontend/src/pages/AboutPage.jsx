import { Upload, ScanSearch, Microscope, Gauge } from 'lucide-react';

function Pipeline() {
  return (
    <div className="pipeline">
      <div className="pipeline-step">
        <div className="pipeline-icon"><Upload size={17} strokeWidth={1.5} /></div>
        <div className="pipeline-content">
          <p className="pipeline-step-title">Bild laddas upp</p>
          <p className="pipeline-step-detail">Förbehandlas till 128×128 pixlar, normaliserad, exakt som under träning.</p>
        </div>
      </div>

      <div className="pipeline-step">
        <div className="pipeline-icon"><ScanSearch size={17} strokeWidth={1.5} /></div>
        <div className="pipeline-content">
          <p className="pipeline-step-title">Steg 1: Gatekeeper-modell</p>
          <p className="pipeline-step-detail">
            EfficientNetB0 (transfer learning), tränad att skilja hudbilder från visuellt
            orelaterat innehåll. Verifierad mot CIFAR-10 och egna testbilder.
          </p>
          <p className="pipeline-branch-note">Om nej: bilden avvisas direkt, ingen bedömning görs</p>
        </div>
      </div>

      <div className="pipeline-step">
        <div className="pipeline-icon"><Microscope size={17} strokeWidth={1.5} /></div>
        <div className="pipeline-content">
          <p className="pipeline-step-title">Steg 2: Cancermodell</p>
          <p className="pipeline-step-detail">
            Samma bastarkitektur, finjusterad på 12 313 bilder från två dataset: HAM10000
            (dermatoskopiska bilder) och PAD-UFES-20 (smartphone-foton, biopsibekräftade
            cancerfall).
          </p>
        </div>
      </div>

      <div className="pipeline-step">
        <div className="pipeline-icon"><Gauge size={17} strokeWidth={1.5} /></div>
        <div className="pipeline-content">
          <p className="pipeline-step-title">Fyra risknivåer</p>
          <p className="pipeline-step-detail">
            Sannolikheten omvandlas till en av fyra nivåer, gränserna satta mot verklig
            testdata, inte en godtycklig tröskel.
          </p>
          <div className="pipeline-tiers">
            <span className="pipeline-tier-pill low">Låg risk</span>
            <span className="pipeline-tier-pill consider">Överväg läkarbedömning</span>
            <span className="pipeline-tier-pill recommend">Rekommenderar läkarbedömning</span>
            <span className="pipeline-tier-pill urgent">Uppsök läkare snarast</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.7rem', marginBottom: '1rem' }}>Om verktyget</h1>

      <div className="prose">
        <p>
          SkinScan är ett studentprojekt som undersöker om maskininlärning kan identifiera
          potentiellt oroande hudförändringar från ett foto. Det är inte, och ska inte
          användas som, ett diagnosverktyg.
        </p>
      </div>

      <h2 style={{ fontSize: '1.15rem', margin: '2rem 0 0' }}>Så är verktyget uppbyggt</h2>
      <Pipeline />

      <div className="prose">
        <h2 style={{ fontSize: '1.15rem', margin: '0 0 0.5rem' }}>Träningsdata</h2>
        <p>
          HAM10000 (cirka 10 000 dermatoskopiska bilder, tagna med specialiserad
          utrustning under kliniska förhållanden) och PAD-UFES-20 (cirka 2 300 bilder
          tagna med vanliga smartphones, samtliga cancerfall biopsibekräftade). Det andra
          datasetet lades till specifikt för att förbättra träffsäkerheten på vanliga
          fotografier, den typ av bild appen faktiskt tar emot.
        </p>

        <h2 style={{ fontSize: '1.15rem', margin: '1.75rem 0 0.5rem' }}>Uppmätt träffsäkerhet</h2>
        <p>
          Utvärderat på 2 463 bilder som modellen aldrig sett under träning. PR-AUC (det
          mått som räknas mest här, eftersom det fokuserar på den mindre, viktigare klassen)
          landade på 0,704 totalt, 0,634 på dermatoskopiska bilder och 0,797 på vanliga
          fotografier. Tröskeln för att flagga en bild är medvetet satt lågt, för att fånga
          cirka 90% av verkliga cancerfall, till priset av fler falska varningar. En missad
          cancer väger tyngre än ett onödigt läkarbesök.
        </p>

        <h2 style={{ fontSize: '1.15rem', margin: '1.75rem 0 0.5rem' }}>Kända begränsningar</h2>
        <p>
          HAM10000 är huvudsakligen insamlat från österrikiska och australiensiska
          patienter, en känd skevhet mot ljusare hudtoner. Verktyget försöker upptäcka
          bilder som inte föreställer hudförändringar alls, men den kontrollen är en
          bästa-möjliga-ansträngning, inte en garanti.
        </p>

        <p style={{ marginTop: '1.75rem', fontWeight: 500 }}>
          Uppsök alltid läkare vid oro över en hudförändring, oavsett vad detta verktyg visar.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;