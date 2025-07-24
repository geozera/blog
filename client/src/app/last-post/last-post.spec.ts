import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastPost } from './last-post';

describe('LastPost', () => {
  let component: LastPost;
  let fixture: ComponentFixture<LastPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
