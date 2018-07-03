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
  @Prop() theme: 'light' | 'dark' = 'light';
  @State() isOpen = false;
  @State() transitioning = false;
  @Event() onClick: EventEmitter;
  @Method()
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    this.onClick.emit(this.isOpen);
    this.animateList(this.isOpen);
  }
  animateList(isOpen: boolean) {
    const list = this.host.shadowRoot.querySelector('div.dropdown-list');
    const animationOptions = {
      direction: 'normal',
      duration: 200,
      iterations: 1,
    };
    const animationOptionsReversed = {...animationOptions, direction: 'reverse'};
    if (isOpen) {
      this.transitioning = true;
      const open = list.animate({
        opacity: [0.5, 1],
        transform: ['scale(0.5)', 'scale(1)'],
      }, animationOptions);
      open.play();
      open.onfinish = () => { this.transitioning = false; };
    } else {
      this.transitioning = true;
      const closed = list.animate({
        opacity: [0.5, 1],
        transform: ['scale(0.5)', 'scale(1)'],
      }, animationOptionsReversed);
      closed.play();
      closed.onfinish = () => { this.transitioning = false; };
    }
  }
  @Listen('document:click')
  handleClick(event: Event): void {
    if (!this.host.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }
  getIconClasses(type: 'caret' | 'angle') {
    return {
      [this.getIconType(type, this.isOpen)]: true
    }
  }
  getIconType(type: 'caret' | 'angle', state: boolean): string {
    return `icon-${type}-${state ? 'up' : 'down'}`;
  }
  getListClasses() {
    return {
      'dropdown-list': true,
      'open': this.isOpen,
      'transitioning': this.transitioning
    }
  }
  hostData() {
    return {
      class: {
        'light': this.theme === 'light',
        'dark': this.theme === 'dark'
      }
    }
  }
  render() {
    return [
      <div class="dropdown-header" onClick={() => this.toggleDropdown()}>{this.label}&nbsp;<i class={this.getIconClasses(this.icon)}></i></div>,
      <div class={this.getListClasses()}>
        <slot />
      </div>
    ]
  }
}
