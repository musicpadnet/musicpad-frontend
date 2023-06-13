import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomMenuComponent } from './room-menu.component';

describe('RoomMenuComponent', () => {
  let component: RoomMenuComponent;
  let fixture: ComponentFixture<RoomMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
