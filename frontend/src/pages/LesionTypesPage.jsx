function LesionTypesPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.7rem', marginBottom: '1rem' }}>Om hudförändringar</h1>

      <div className="prose">
        <p>
          SkinScan tränas för att skilja mellan åtta kategorier av hudförändringar, samma
          uppdelning som används inom klinisk dermatologi och i de dataset modellen är
          tränad på. Fyra räknas som cancerösa eller cancerförstadier, fyra som godartade.
        </p>
      </div>

      <h2 style={{ fontSize: '1.15rem', margin: '2rem 0 0.5rem' }}>ABCDE-regeln</h2>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
        Fem tecken dermatologer använder för att bedöma om ett märke bör undersökas.
      </p>
      <div className="abcde-grid">
        <span className="abcde-letter">A</span>
        <span className="abcde-text">Asymmetri, den ena halvan matchar inte den andra.</span>
        <span className="abcde-letter">B</span>
        <span className="abcde-text">Border, ojämn eller diffus kant.</span>
        <span className="abcde-letter">C</span>
        <span className="abcde-text">Color, flera färger eller ojämn färgfördelning.</span>
        <span className="abcde-letter">D</span>
        <span className="abcde-text">Diameter, större än cirka 6 mm.</span>
        <span className="abcde-letter">E</span>
        <span className="abcde-text">Evolving, förändras i storlek, form eller färg över tid.</span>
      </div>

      <h2 style={{ fontSize: '1.15rem', margin: '2rem 0 0' }}>Cancerösa förändringar och cancerförstadier</h2>
      <div className="lesion-group">
        <div className="lesion-card concerning">
          <p className="lesion-card-name">Melanom</p>
          <p className="lesion-card-latin">Melanoma</p>
          <p className="lesion-card-desc">
            Uppstår i de pigmentproducerande cellerna (melanocyter). Den farligaste
            hudcancerformen, men mycket behandlingsbar vid tidig upptäckt. Kännetecknas
            ofta av flera av ABCDE-tecknen ovan.
          </p>
        </div>
        <div className="lesion-card concerning">
          <p className="lesion-card-name">Basalcellscancer</p>
          <p className="lesion-card-latin">Basal cell carcinoma</p>
          <p className="lesion-card-desc">
            Den vanligaste formen av hudcancer. Syns ofta som en blank, pärlemorliknande
            knöl med små synliga blodkärl, eller som en platt, fjällande fläck. Växer
            långsamt och sprider sig sällan, men kan skada omkringliggande vävnad
            obehandlad.
          </p>
        </div>
        <div className="lesion-card concerning">
          <p className="lesion-card-name">Skivepitelcancer</p>
          <p className="lesion-card-latin">Squamous cell carcinoma</p>
          <p className="lesion-card-desc">
            Näst vanligaste hudcancerformen, uppstår ofta ur en obehandlad aktinisk
            keratos. Kan se ut som en fjällande röd fläck, en vårtliknande knöl, eller ett
            sår som inte läker och lätt blöder.
          </p>
        </div>
        <div className="lesion-card concerning">
          <p className="lesion-card-name">Aktinisk keratos</p>
          <p className="lesion-card-latin">Actinic keratosis</p>
          <p className="lesion-card-desc">
            Ett cancerförstadium orsakat av långvarig solskada, vanligast hos ljushyade
            personer över 40 år. Syns som en torr, sträv eller fjällig fläck. Obehandlad
            utvecklas en mindre del till skivepitelcancer.
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.15rem', margin: '2rem 0 0' }}>Godartade hudförändringar</h2>
      <div className="lesion-group">
        <div className="lesion-card benign">
          <p className="lesion-card-name">Vanligt melanocytärt nevus (leverfläck)</p>
          <p className="lesion-card-latin">Melanocytic nevus</p>
          <p className="lesion-card-desc">
            Den vanligaste godartade hudförändringen. De flesta har flera. Vanligtvis
            rund eller oval, jämn kant, en enhetlig brun eller beige färg. Utvecklas
            mycket sällan till melanom, men förändringar bör ändå följas.
          </p>
        </div>
        <div className="lesion-card benign">
          <p className="lesion-card-name">Seborroisk keratos</p>
          <p className="lesion-card-latin">Seborrheic keratosis</p>
          <p className="lesion-card-desc">
            Mycket vanlig, ofarlig hudförändring med ett vaxartat, nästan "pålimmat"
            utseende. Består inte av melanocyter och kan därför inte utvecklas till
            melanom, men kan visuellt likna oroande förändringar.
          </p>
        </div>
        <div className="lesion-card benign">
          <p className="lesion-card-name">Dermatofibrom</p>
          <p className="lesion-card-latin">Dermatofibroma</p>
          <p className="lesion-card-desc">
            En liten, fast knöl, vanligast på ben eller armar, oftast brunaktig och helt
            ofarlig. Ett kännetecken är att den ofta sjunker något inåt när huden runt
            omkring kläms ihop.
          </p>
        </div>
        <div className="lesion-card benign">
          <p className="lesion-card-name">Vaskulär förändring</p>
          <p className="lesion-card-latin">Vascular lesion</p>
          <p className="lesion-card-desc">
            Bildas av blodkärl och syns som röda eller lila fläckar eller knölar.
            Innefattar bland annat blodkärlsknutor (hemangiom). Vanligtvis helt godartade.
          </p>
        </div>
      </div>

      <div className="prose">
        <p style={{ fontWeight: 500 }}>
          Den här sidan är allmän information, inte en diagnos. Endast en läkare kan
          avgöra vad en specifik hudförändring faktiskt är.
        </p>
      </div>
    </div>
  );
}

export default LesionTypesPage;