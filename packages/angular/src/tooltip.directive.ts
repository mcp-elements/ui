import { Directive, input, signal, HostListener, ElementRef, Renderer2, OnDestroy } from '@angular/core'

@Directive({
  selector: '[mcpeTooltip]',
  standalone: true,
})
export class SnxTooltipDirective implements OnDestroy {
  mcpeTooltip = input<string>('')
  tooltipDelay = input(700)

  private tooltipEl: HTMLElement | null = null
  private timeoutId: ReturnType<typeof setTimeout> | null = null

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  @HostListener('focus')
  onShow() {
    this.clearDelay()
    this.timeoutId = setTimeout(() => this.show(), this.tooltipDelay())
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  onHide() {
    this.clearDelay()
    this.hide()
  }

  private show() {
    if (this.tooltipEl) return
    this.tooltipEl = this.renderer.createElement('div')
    this.renderer.addClass(this.tooltipEl, 'mcpe-tooltip-content')
    this.renderer.setStyle(this.tooltipEl, 'position', 'absolute')
    this.renderer.setStyle(this.tooltipEl, 'bottom', '100%')
    this.renderer.setStyle(this.tooltipEl, 'left', '50%')
    this.renderer.setStyle(this.tooltipEl, 'transform', 'translateX(-50%)')
    this.renderer.setStyle(this.tooltipEl, 'margin-bottom', '0.5rem')
    const text = this.renderer.createText(this.mcpeTooltip())
    this.renderer.appendChild(this.tooltipEl, text)
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative')
    this.renderer.appendChild(this.el.nativeElement, this.tooltipEl)
  }

  private hide() {
    if (this.tooltipEl) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipEl)
      this.tooltipEl = null
    }
  }

  private clearDelay() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  ngOnDestroy() {
    this.clearDelay()
    this.hide()
  }
}
