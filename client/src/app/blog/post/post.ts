import { Component, Input, OnInit } from '@angular/core';
import { IPost } from '../../shared/interfaces/post.interface';

@Component({
    selector: 'app-post',
    templateUrl: './post.html',
    styleUrl: './post.scss',
    standalone: false,
    inputs: [{ name: 'post', required: true }]
})
export class PostComponent implements OnInit {
    @Input('post') post!: IPost;

    header: string = '...';
    subHeader: string = '...';

    ngOnInit(): void {
        if (this.post) {
            this.header = this.post?.title || '';
            this.subHeader = `por ${this.post?.author || 'Anônimo'} em ${new Date(String(this.post.createdAt)).toLocaleDateString()}`;
        }
    }
}
