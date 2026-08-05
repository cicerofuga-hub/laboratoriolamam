/* Modal de orçamento reutilizável para as páginas de serviço.
   Injeta CSS + HTML + lógica de envio (Web3Forms) e abre NO LUGAR (sem navegar).
   Uso: num link/botão, adicione  data-orc-open  e (opcional)  data-orc="<Análise>"
   para já marcar o checkbox correspondente.
   Obs.: a chave Web3Forms e o formulário são os MESMOS do modal inline do index.html
   (se um dia trocar a chave, trocar nos dois lugares). */
(function(){
  var CSS = `
  .orc-modal{position:fixed;inset:0;z-index:210;display:none;padding:20px;overflow-y:auto;
    background:rgba(4,10,18,.72);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
  .orc-modal.on{display:block}
  .orc-cx{background:#fff;color:#37505f;max-width:560px;width:100%;border-radius:18px;padding:30px 32px;
    box-shadow:0 30px 80px rgba(0,0,0,.45);font-family:'Inter',system-ui,Arial,sans-serif;position:relative;margin:24px auto}
  .orc-cx h2{font-family:'Poppins',sans-serif;font-size:1.35rem;color:#15507a;margin:0 0 4px;font-weight:700}
  .orc-sub{font-size:.9rem;color:#5b7085;margin:0 0 18px;line-height:1.5}
  .orc-x{position:absolute;top:14px;right:16px;background:none;border:none;font-size:26px;line-height:1;color:#8295a3;cursor:pointer}
  .orc-x:hover{color:#15507a}
  .orc-field{margin-bottom:14px}
  .orc-field label.lbl{display:block;font-size:.82rem;font-weight:600;color:#37505f;margin-bottom:5px}
  .orc-field input,.orc-field textarea{width:100%;padding:11px 13px;border:1px solid #d6e3ee;border-radius:10px;
    font-family:inherit;font-size:.92rem;color:#37505f;background:#f9fbfd}
  .orc-field input:focus,.orc-field textarea:focus{outline:none;border-color:#3da9dc;box-shadow:0 0 0 3px rgba(61,169,220,.15)}
  .orc-field textarea{resize:vertical;min-height:82px}
  .orc-checks{display:grid;grid-template-columns:1fr 1fr;gap:7px 14px;margin-top:2px}
  .orc-checks label{display:flex;align-items:center;gap:8px;font-size:.85rem;font-weight:500;color:#37505f;cursor:pointer}
  .orc-checks input{width:auto;accent-color:#3da9dc;flex:0 0 auto}
  .orc-send{width:100%;margin-top:8px;padding:13px;border:none;border-radius:30px;cursor:pointer;
    background:linear-gradient(135deg,#5cc6f5,#3da9dc);color:#04121c;font-weight:700;font-size:.98rem;font-family:inherit;
    display:flex;align-items:center;justify-content:center;gap:8px;transition:transform .15s}
  .orc-send:hover{transform:translateY(-2px)}
  .orc-send svg{width:18px;height:18px}
  .orc-note{font-size:.78rem;color:#8295a3;margin:10px 0 0;text-align:center;line-height:1.5}
  .orc-cx .hp{display:none}
  .orc-status{font-size:.86rem;text-align:center;margin:12px 0 0;min-height:1.1em;line-height:1.5}
  .orc-status.ok{color:#1f9d57;font-weight:600}
  .orc-status.err{color:#c23a3a}
  .orc-send[disabled]{opacity:.6;cursor:default;transform:none}
  .chkline{display:flex;align-items:flex-start;gap:8px;font-size:.88rem;font-weight:500;color:#37505f;cursor:pointer;line-height:1.4}
  .chkline input{width:auto;accent-color:#3da9dc;flex:0 0 auto;margin-top:2px}
  .orc-formal{border:1px dashed #cfe0ee;border-radius:10px;padding:14px 14px 2px;margin:6px 0 4px;background:#f6fafd}
  .orc-formal[hidden]{display:none}
  @media(max-width:520px){.orc-cx{padding:24px 20px}.orc-checks{grid-template-columns:1fr}}`;

  var HTML = `
  <div class="orc-modal" id="orcModal" role="dialog" aria-modal="true" aria-labelledby="orc-t">
    <div class="orc-cx">
      <button class="orc-x" id="orcClose" type="button" aria-label="Fechar">&times;</button>
      <h2 id="orc-t">Solicitar orçamento</h2>
      <p class="orc-sub">Preencha os dados e enviaremos o retorno por e-mail. Também fazemos <b>convênios</b> para atendimento recorrente.</p>
      <form id="orcForm">
        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="orc-field"><label class="lbl" for="orc-nome">Nome *</label><input id="orc-nome" name="nome" type="text" required></div>
        <div class="orc-field"><label class="lbl" for="orc-email">E-mail *</label><input id="orc-email" name="email" type="email" required></div>
        <div class="orc-field"><label class="lbl" for="orc-fone">WhatsApp / telefone</label><input id="orc-fone" name="fone" type="tel"></div>
        <div class="orc-field">
          <label class="lbl">Análises de interesse</label>
          <div class="orc-checks">
            <label><input type="checkbox" name="analise" value="Fitonematoides"> Fitonematoides</label>
            <label><input type="checkbox" name="analise" value="PCR de fitonematoides"> PCR de fitonematoides</label>
            <label><input type="checkbox" name="analise" value="Fungos de solo"> Fungos de solo</label>
            <label><input type="checkbox" name="analise" value="Patologia de plantas"> Patologia de plantas</label>
            <label><input type="checkbox" name="analise" value="Patologia de sementes"> Patologia de sementes</label>
            <label><input type="checkbox" name="analise" value="Compatibilidade de bioinsumos"> Compatibilidade</label>
            <label><input type="checkbox" name="analise" value="CQ de produto comercial"> CQ produto comercial</label>
            <label><input type="checkbox" name="analise" value="CQ On Farm"> CQ On Farm</label>
            <label><input type="checkbox" name="analise" value="Contaminantes"> Contaminantes</label>
            <label><input type="checkbox" name="analise" value="Recuperação em sementes"> Recuperação em sementes</label>
            <label><input type="checkbox" name="analise" value="Conídios viáveis"> Conídios viáveis</label>
            <label><input type="checkbox" name="analise" value="Antagonismo"> Antagonismo</label>
            <label><input type="checkbox" name="analise" value="Placas resinadas"> Placas resinadas</label>
            <label><input type="checkbox" name="analise" value="Broca-do-café"> Broca-do-café</label>
          </div>
        </div>
        <div class="orc-field"><label class="lbl" for="orc-qtd">Quantidade de amostras (envio)</label><input id="orc-qtd" name="qtd" type="text" placeholder="ex.: 10 amostras"></div>
        <div class="orc-field"><label class="lbl" for="orc-msg">Mensagem</label><textarea id="orc-msg" name="msg" placeholder="Conte sobre a cultura, o objetivo, etc."></textarea></div>
        <div class="orc-field">
          <label class="chkline"><input type="checkbox" id="orc-formal-chk"><span>Quero receber um <b>orçamento formal (PDF)</b> — preencha os dados cadastrais para emissão</span></label>
        </div>
        <div class="orc-formal" id="orcFormal" hidden>
          <div class="orc-field"><label class="lbl" for="orc-doc">CPF / CNPJ</label><input id="orc-doc" name="doc" type="text"></div>
          <div class="orc-field"><label class="lbl" for="orc-razao">Razão social / Nome completo</label><input id="orc-razao" name="razao" type="text"></div>
          <div class="orc-field"><label class="lbl" for="orc-ie">Inscrição Estadual (se houver)</label><input id="orc-ie" name="ie" type="text"></div>
          <div class="orc-field"><label class="lbl" for="orc-end">Endereço completo (rua, nº, bairro, cidade/UF, CEP)</label><textarea id="orc-end" name="endereco"></textarea></div>
        </div>
        <button class="orc-send" type="submit">Enviar solicitação
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
        </button>
        <p class="orc-status" id="orcStatus" role="status" aria-live="polite"></p>
        <p class="orc-note">Retornamos por e-mail. Seus dados são usados apenas para responder à solicitação.</p>
      </form>
    </div>
  </div>`;

  function init(){
    var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
    var host=document.createElement('div'); host.innerHTML=HTML;
    while(host.firstChild) document.body.appendChild(host.firstChild);

    var modal=document.getElementById('orcModal'),
        closeBtn=document.getElementById('orcClose'),
        form=document.getElementById('orcForm');
    function abrir(){ modal.classList.add('on'); document.body.style.overflow='hidden'; }
    function fechar(){ modal.classList.remove('on'); document.body.style.overflow=''; }
    function marcar(val){ if(!val) return;
      var cb=form.querySelector('input[name="analise"][value="'+val+'"]'); if(cb) cb.checked=true; }

    var triggers=document.querySelectorAll('[data-orc-open]');
    for(var i=0;i<triggers.length;i++){
      (function(t){
        t.addEventListener('click', function(e){ e.preventDefault(); marcar(t.getAttribute('data-orc')||''); abrir(); });
      })(triggers[i]);
    }

    var formalChk=document.getElementById('orc-formal-chk'), formalBox=document.getElementById('orcFormal');
    if(formalChk) formalChk.addEventListener('change', function(){ formalBox.hidden=!formalChk.checked; });
    closeBtn.addEventListener('click', fechar);
    modal.addEventListener('click', function(e){ if(e.target===modal) fechar(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && modal.classList.contains('on')) fechar(); });

    var ACCESS_KEY='be67f93f-8ec7-455b-a68c-40cace448d92';
    var statusEl=document.getElementById('orcStatus'), sendBtn=form.querySelector('.orc-send');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var nome=form.nome.value.trim(), email=form.email.value.trim(), fone=form.fone.value.trim(),
          qtd=form.qtd.value.trim(), msg=form.msg.value.trim();
      var ans=[].slice.call(form.querySelectorAll('input[name="analise"]:checked')).map(function(c){return c.value;});
      var formal=!!(formalChk && formalChk.checked);
      var corpo='WhatsApp/telefone: '+(fone||'—')
        +'\nAnálises de interesse: '+(ans.length?ans.join(', '):'—')
        +'\nQuantidade de amostras: '+(qtd||'—')
        +'\n\nMensagem:\n'+(msg||'—');
      if(formal){
        corpo += '\n\n--- Orçamento formal (PDF) solicitado ---'
          +'\nCPF/CNPJ: '+(form.doc.value.trim()||'—')
          +'\nRazão social/Nome: '+(form.razao.value.trim()||'—')
          +'\nInscrição Estadual: '+(form.ie.value.trim()||'—')
          +'\nEndereço: '+(form.endereco.value.trim()||'—');
      }
      var payload={ access_key:ACCESS_KEY,
        subject:'Nova solicitação de orçamento'+(formal?' FORMAL (PDF)':'')+' — Site LAMAM',
        from_name:'Site LAMAM', botcheck:form.botcheck.checked, name:nome, email:email, message:corpo };
      var falha='Não foi possível enviar agora. Fale pelo WhatsApp ou escreva para '
        +'<a href="mailto:lamam@laboratoriolamam.com.br">lamam@laboratoriolamam.com.br</a>.';
      statusEl.textContent='Enviando...'; statusEl.className='orc-status'; sendBtn.disabled=true;
      fetch('https://api.web3forms.com/submit',{method:'POST',
          headers:{'Content-Type':'application/json',Accept:'application/json'},
          body:JSON.stringify(payload)})
        .then(function(r){return r.json();})
        .then(function(j){
          sendBtn.disabled=false;
          if(j&&j.success){
            statusEl.textContent='Solicitação enviada! Retornaremos por e-mail em breve.';
            statusEl.className='orc-status ok'; form.reset(); if(formalBox) formalBox.hidden=true; setTimeout(fechar,2400);
          } else { statusEl.innerHTML=falha; statusEl.className='orc-status err'; }
        })
        .catch(function(){ sendBtn.disabled=false; statusEl.innerHTML=falha; statusEl.className='orc-status err'; });
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
