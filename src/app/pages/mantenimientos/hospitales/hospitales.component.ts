import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
                private modalImagenService: ModalImagenService,
                private busquedaService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(1000))
    .subscribe(img =>this.cargarHospitales())

  }


  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
        .subscribe( hospitales => {
          this.cargando = false;
          this.hospitales = hospitales;
        })
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
        .subscribe( resp => {
          Swal.fire('Actualizado', hospital.nombre, 'success');
        });
  }


  eliminarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital._id)
        .subscribe( resp => {
          this.cargarHospitales();
          Swal.fire('Eliminado', hospital.nombre, 'success');
        });
  }


  async abrirSweetAlert() {
    	
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    })
    
    if (value.trim().length > 0 ) {
      this.hospitalService.crearHospital(value)
          .subscribe((resp: any) =>{
            this.hospitales.push(resp.hospital)
          })
    }
  }

  buscar(termino:string) {

    if( termino.length === 0 ) {
      return this.cargarHospitales();
    }

    this.busquedaService.buscar('hospitales', termino)
        .subscribe( resp => {
          this.hospitales = resp;
        });
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

  



}
