import ModelError from "/ModelError.js";

export default class Medico {
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #crm;
  #nome;
  #especialidade;

  //-----------------------------------------------------------------------------------------//

  constructor(crm, nome, especialidade) {
    this.setCrm(crm);
    this.setEspecialidade(especialidade);
    this.setNome(nome); 
  }
  
  //-----------------------------------------------------------------------------------------//

  getCrm() {
    return this.#crm;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCrm(crm) {
    if(!Medico.validarCrm(crm))
      throw new ModelError("Crm Inválido: " + crm);
    this.#crm = crm;
  }
  
  //-----------------------------------------------------------------------------------------//

  getEspecialidade() {
    return this.#especialidade;
  }
  
  //-----------------------------------------------------------------------------------------//

  setEspecialidade(especialidade) {
    if(!Medico.validarEspecialidade(especialidade))
      throw new ModelError("Especialidade Inválida: " + especialidade);
    this.#especialidade = especialidade;
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
               '"crm" : "'+ this.#crm + '",' +
               '"especialidade" :  "'     + this.#especialidade       + '",' +
               '"nome" : "'     + this.#nome      + '" ' + 
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Departamento(obj.crm, obj.especialidade, obj.nome);
  }

  //-----------------------------------------------------------------------------------------//
  
  static deassign(obj) { 
    return JSON.parse(obj.toJSON());
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

    static validarCrm(crm) {
//         if(sigla == null || sigla == "" || sigla == undefined)
//           return false;
//         if (sigla.length > 2) 
//           return false;
//         const padraoSigla = /[A-Z] */;
//         if (!padraoSigla.test(sigla)) 
//           return false;
//         return true;
//       }

//     static validarNumEmpregados(numEmpregados) {
//         if (numEmpregados.length > 0) 
//           return true;
//         return false;
    }

  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Crm: " + this.crm + "\n";
    texto += "Nome: " + this.nome + "\n";
    texto += "Especialidade: " + this.especialidade + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}
