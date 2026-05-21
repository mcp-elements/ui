import { Component } from '@angular/core'

@Component({
  selector: 'mcpe-streaming-text',
  standalone: true,
  template: `<div class="mcpe-streaming-text-cursor"><ng-content /></div>`,
})
export class SnxStreamingTextComponent {}

@Component({
  selector: 'mcpe-streaming-text-fade-in',
  standalone: true,
  template: `<span class="mcpe-streaming-text-fade-in"><ng-content /></span>`,
})
export class SnxStreamingTextFadeInComponent {}

@Component({
  selector: 'mcpe-streaming-text-word',
  standalone: true,
  template: `<span class="mcpe-streaming-text-word"><ng-content /></span>`,
})
export class SnxStreamingTextWordComponent {}

@Component({
  selector: 'mcpe-streaming-text-line',
  standalone: true,
  template: `<div class="mcpe-streaming-text-line"><ng-content /></div>`,
})
export class SnxStreamingTextLineComponent {}

@Component({
  selector: 'mcpe-streaming-text-skeleton',
  standalone: true,
  template: `<div class="mcpe-streaming-text-skeleton"><ng-content /></div>`,
})
export class SnxStreamingTextSkeletonComponent {}

@Component({
  selector: 'mcpe-streaming-text-skeleton-line',
  standalone: true,
  template: `<div class="mcpe-streaming-text-skeleton-line"></div>`,
})
export class SnxStreamingTextSkeletonLineComponent {}
