import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    // Entre comillas lo que va por defecto
    // Y una validacion que indica que esa parte es obligatoria

    // Si el usuario tildo en recordar usuario lo 
    // leemos del local storage y sino mandamos un string vacio
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    remember: [false]
  });


  constructor( private router: Router,
                private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private ngZone: NgZone ) { }

  ngOnInit(): void {
    this.renderButton();
  }



  login(){

    this.usuarioService.login( this.loginForm.value)
        .subscribe( resp => {
          if( this.loginForm.get('remember').value ) {
            localStorage.setItem('email', this.loginForm.get('email').value );
          } else {
            localStorage.removeItem('email');
          }

           // Navegar al dashboard
           this.router.navigateByUrl('/');

        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        })



    // console.log(this.loginForm.value);
    
    // this.router.navigateByUrl('/');
  }


  // Para implementar boton de login de google
  // var id_token = googleUser.getAuthResponse().id_token;



  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    this.startApp();
  }





  async startApp() {

    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));

  };



  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          var id_token = googleUser.getAuthResponse().id_token;
          // console.log(id_token);
          this.usuarioService.loginGoogle(id_token)
          .subscribe(resp => {
              // Navegar al dashboard
              this.ngZone.run( () => {
                this.router.navigateByUrl('/');
              });
          });



        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


}
