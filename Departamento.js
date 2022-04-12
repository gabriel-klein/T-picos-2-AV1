import ModelError from "/ModelError.js";

export default class Departamento {
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #sigla;
  #numeroDeEmpregados;
  #nome;

  //-----------------------------------------------------------------------------------------//

  constructor(sigla, numeroDeEmpregados, nome, email, telefone) {
    this.setSigla(sigla);
    this.setNumeroDeEmpregados(numeroDeEmpregados);
    this.setNome(nome); 
  }
  
  //-----------------------------------------------------------------------------------------//

  getSigla() {
    return this.#sigla;
  }
  
  //-----------------------------------------------------------------------------------------//

  setSigla(sigla) {
    if(!Departamento.validarSigla(sigla))
      throw new ModelError("Matrícula Inválida: " + sigla);
    this.#sigla = sigla;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNumeroDeEmpregados() {
    return this.#numeroDeEmpregados;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNumeroDeEmpregados(numeroDeEmpregados) {
    if(!Departamento.validarNumeroDeEmpregados(numeroDeEmpregados))
      throw new ModelError("CPF Inválido: " + numeroDeEmpregados);
    this.#numeroDeEmpregados = numeroDeEmpregados;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.#nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    if(!Departamento.validarNome(nome))
      throw new ModelError("Nome Inválido: " + nome);
    this.#nome = nome;
  }

  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return '{' +
               '"sigla" : "'+ this.#sigla + '",' +
               '"numeroDeEmpregados" :  "'     + this.#numeroDeEmpregados       + '",' +
               '"nome" : "'     + this.#nome      + '" ' + 
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Departamento(obj.sigla, obj.numeroDeEmpregados, obj.nome);
  }

  //-----------------------------------------------------------------------------------------//
  
  static deassign(obj) { 
    return JSON.parse(obj.toJSON());
  }

  //-----------------------------------------------------------------------------------------//

  static validarSigla(sigla) {
    if(sigla == null || sigla == "" || sigla == undefined)
      return false;
    const padraoSigla = /[0-9]/;
    if (!padraoSigla.test(sigla))
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarNome(nome) {
    if(nome == null || nome == "" || nome == undefined)
      return false;
    if (nome.length > 40) 
      return false;
    const padraoNome = /[A-Z][a-z] */;
    if (!padraoNome.test(nome)) 
      return false;
    return true;
  }

    //-----------------------------------------------------------------------------------------//

    static validarSigla(sigla) {
        if(sigla == null || sigla == "" || sigla == undefined)
          return false;
        if (sigla.length > 2) 
          return false;
        const padraoSigla = /[A-Z][a-z] */;
        if (!padraoSigla.test(sigla)) 
          return false;
        return true;
      }

    static validarNumeroDeEmpregados(sigla) {
        if (sigla.length > 0) 
          return true;
        return false;
    }

  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Sigla: " + this.sigla + "\n";
    texto += "Nome: " + this.nome + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}