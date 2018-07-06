import { Component, Element, Prop, Method, State, Event, EventEmitter, Listen } from '@stencil/core';
@Component({
  tag: 'ui-dropdown',
  styleUrl: './dropdown.css',
  shadow: true
})
export class Dropdown {
  @Element() host;
  @Prop() label: string;
  @Prop() icon: 'caret' | 'angle' = 'caret';
  @State() isOpen = false;
  @State() isAnimating = false;
  @Event() onClickCallback: EventEmitter;
  @Method()
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    this.onClickCallback.emit(this.isOpen);
    this.animateList(this.isOpen);
  }
  @Listen('document:click')
  handleOffClick(event: Event): void {
    if (!this.host.contains(event.target as Node) && this.isOpen) {
      this.isOpen = false;
      this.animateList(this.isOpen);
    }
  }
  animateList(isOpen: boolean): void {
    const slideAnimation = [
      {
        transform: 'translate3d(0, -16%, 0)',
        opacity: '0',
        offset: 0
      },
      {
        transform: 'scale(0.98)',
      },
      {
        opacity: '0.6',
        transform: 'scale(1)',
        offset: .88
      },
      {
        transform: 'translate3d(0, 0, 0)',
        opacity: '1',
        offset: 1
      }
    ];
    const animationOptions = {
      direction: 'normal',
      duration: 160,
      iterations: 1,
    };
    isOpen ?
      this.playAnimation(slideAnimation, animationOptions) :
      this.playAnimation(slideAnimation, {...animationOptions, direction: 'reverse'});
  }
  playAnimation(animation, options): void {
    const list = this.host.shadowRoot.querySelector('div.dropdown-list');
    const listAnimation = (options: {}) => list.animate(animation, options);
    this.isAnimating = true;
    listAnimation(options).play();
    listAnimation(options).onfinish = () => { this.isAnimating = false; };
  }
  getIconClasses(type: 'caret' | 'angle') {
    return {
      [this.getIconType(type, this.isOpen)]: true
    }
  }
  getIconType(type: 'caret' | 'angle', state: boolean): string {
    return `icon-${type}-${state ? 'up' : 'down'}`;
  }
  hostData() {
    return {
      class: {
        'open': this.isOpen,
        'animating': this.isAnimating
      },
      'aria-expanded': this.isOpen,
      tabindex: -1,
    }
  }
  render() {
    return [
      <div class="dropdown-header" onClick={() => this.toggleDropdown()}>
        <span>{this.label}</span>
        <i class={this.getIconClasses(this.icon)}></i>
      </div>,
      <div class="dropdown-list">
        <slot />
      </div>
    ]
  }
}
