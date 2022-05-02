"use strict";

import Status from "/Status.js";
import Medico from "/Medico.js";
import DaoMedico from "/DaoMedico.js";
import ViewerMedico from "/ViewerMedico.js";

export default class CtrlManterMedico {

  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao;      // Referência para o Data Access Object para o Store de Departamentos
  #viewer;   // Referência para o gerenciador do viewer 
  #posAtual; // Indica a posição do objeto Departamento que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 

  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoMedico();
    this.#viewer = new ViewerMedico(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }

  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();

    // Solicita ao DAO que dê a lista de todos os departamentos presentes na base
    let conjDeptos = await this.#dao.obterMedicos();

    // Se a lista de departamentos estiver vazia
    if(conjDeptos.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;

      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjDeptos.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjDeptos.length, conjDeptos[this.#posAtual - 1]);
    }
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjMedicos = await this.#dao.obterMedicos();
    if(conjMedicos.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjMedicos = await this.#dao.obterMedicos();
    if(this.#posAtual < conjDeptos.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjMedicos = await this.#dao.obterMedicos();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjMedicos = await this.#dao.Medicos();
    this.#posAtual = conjMedicos.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//

  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//

  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(sigla, nome, numMedicos) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let medico = new Medico(sigla, nome, numMedicos);
        await this.#dao.incluir(medico); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(sigla, nome, numMedicos) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let medico = await this.#dao.obterMedicosPelaSigla(sigla); 
        if(medico == null) {
          alert("Medico com a sigla " + sigla + " não encontrado.");
        } else {
          medico.setNome(nome);
          medico.setNumMedicos(numMedicos);
          await this.#dao.alterar(medico); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  async excluir(sigla) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let medico = await this.#dao.obterMedicoPelaSigla(sigla); 
        if(medico == null) {
          alert("Medico com a sigla " + sigla + " não encontrado.");
        } else {
          await this.#dao.excluir(medico); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//