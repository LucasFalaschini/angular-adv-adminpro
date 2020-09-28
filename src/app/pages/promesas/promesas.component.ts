import { Component, OnInit } from '@angular/core';
import { resolve } from 'dns';
import { promise } from 'protractor';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: []
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then(usuarios => {
      console.log(usuarios)
    });

    // const promesa = new Promise( ( resolve, reject ) => {

    //   if(false) {
    //     resolve('Hola Mundo');
    //   }
    //   else {
    //     reject('Hola Mundillo');
    //   }
    // });

    // promesa.then( (mensaje) => {
    //   console.log( mensaje );
    // }).catch( error => console.log('Error en mi promesa:', error ));

    // console.log('Fin del Init');

  }

  getUsuarios() {

    return new Promise( resolve => {

      fetch('https://reqres.in/api/user')
        .then( resp => resp.json() )
        .then( body => resolve( body.data )
        );
    });

  }

}
