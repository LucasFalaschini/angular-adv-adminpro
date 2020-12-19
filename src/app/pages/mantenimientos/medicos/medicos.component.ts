import { Medico } from './../../../models/medico.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean;
  public medicos: Medico[] = [];
  private imgSubs: Subscription;

  constructor(private medicosService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(1000))
    .subscribe(img =>this.cargarMedicos())
  }


  cargarMedicos() {
    this.cargando = true;
    this.medicosService.cargarMedicos()
        .subscribe( medicos => {
          this.cargando = false;
          this.medicos = medicos;
        })
  }


  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);

  }

  buscar(termino: string) {
    if( termino.length === 0 ) {
      return this.cargarMedicos();
    }

    this.busquedaService.buscar('medicos', termino)
        .subscribe( resp => {
          this.medicos = resp;
        });
  }

  
  eliminarMedico(medico: Medico) {

    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicosService.borrarMedico(medico._id)
            .subscribe( resp => {

              this.cargarMedicos();
              Swal.fire(
                'Medico borrado',
                `${medico.nombre} fue eliminado correctamente`,
                'success'
              );

            });
      }
    })
  }


}
