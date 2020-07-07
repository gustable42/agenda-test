import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatosListComponent } from './contatos-list.component';

describe('ContatosListComponent', () => {
  let component: ContatosListComponent;
  let fixture: ComponentFixture<ContatosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContatosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
