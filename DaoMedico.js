"use strict";

import ModelError from "/ModelError.js";
import Medico from "/Medico.js";

export default class DaoMedico {

    //-----------------------------------------------------------------------------------------//

    static conexao = null;

    constructor() {
        this.arrayMedicos = [];
        this.obterConexao();
    }

    /*
    *  Devolve uma Promise com a referência para o BD
    */ 
    async obterConexao() {
        if(DaoMedico.conexao == null) {
            DaoMedico.conexao = new Promise(function(resolve, reject) {
            let requestDB = window.indexedDB.open("MedicoDB", 1); 

            requestDB.onupgradeneeded = (event) => {
            let db = event.target.result;
            let store = db.createObjectStore("MedicoST", {
                autoIncrement: true
            });
            store.createIndex("idxSigla", "sigla", { unique: true });
            };

            requestDB.onerror = event => {
            reject(new ModelError("Erro: " + event.target.errorCode));
            };

            requestDB.onsuccess = event => {
            if (event.target.result) {
                // event.target.result apontará para IDBDatabase aberto
                resolve(event.target.result);
            }
            else 
                reject(new ModelError("Erro: " + event.target.errorCode));
            };
        });
        }
        return await DaoMedico.conexao;
    }

    //-----------------------------------------------------------------------------------------//

    async obterMedicos() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["MedicoST"], "readonly");
                store = transacao.objectStore("MedicoST");
                indice = store.index('idxSigla');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }
            let array = [];
            indice.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {        
                const novo = Medico.assign(cursor.value);
                array.push(novo);
                cursor.continue();
                } else {
                resolve(array);
                }
            };
        });
        this.arrayMedicos = await promessa;
        return this.arrayMedicos;
    }

    //-----------------------------------------------------------------------------------------//

    async obterMedicoPelaSigla(sigla) {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["MedicoST"], "readonly");
                store = transacao.objectStore("MedicoST");
                indice = store.index('idxSigla');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }

            let consulta = indice.get(sigla);
            consulta.onsuccess = function(event) { 
                if(consulta.result != null)
                resolve(Medico.assign(consulta.result)); 
                else
                resolve(null);
            };
            consulta.onerror = function(event) { reject(null); };
        });
        let medico = await promessa;
        return medico;
    }

    //-----------------------------------------------------------------------------------------//

    async obterMedicosPeloAutoIncrement() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
        let transacao;
        let store;
        try {
            transacao = connection.transaction(["MedicoST"], "readonly");
            store = transacao.objectStore("MedicoST");
        } 
        catch (e) {
            reject(new ModelError("Erro: " + e));
        }
        let array = [];
        store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {        
            const novo = Medico.assign(cursor.value);
            array.push(novo);
            cursor.continue();
            } else {
            resolve(array);
            }
        };
        });
        this.arrayMedicos = await promessa;
        return this.arrayMedicos;
    }

     //-----------------------------------------------------------------------------------------//

  async incluir(medico) {
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["MedicoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o medico", event.target.error));
      };
      let store = transacao.objectStore("MedicoST");
      let requisicao = store.add(Medico.deassign(medico));
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(medico) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["MedicoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o medico", event.target.error));
      };
      let store = transacao.objectStore("MedicoST");     
      let indice = store.index('idxSigla');
      var keyValue = IDBKeyRange.only(medico.getSigla());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.sigla == medico.getSigla()) {
            const request = cursor.update(Medico.deassign(medico));
            request.onsuccess = () => {
              console.log("[DaoMedico.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Medico com a sigla " + medico.getSigla() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(medico) {
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["MedicoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o medico", event.target.error));
      };
      let store = transacao.objectStore("MedicoST");
      let indice = store.index('idxSigla');
      var keyValue = IDBKeyRange.only(medico.getSigla());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.sigla == medico.getSigla()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Medico com a sigla " + medico.getSigla() + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}