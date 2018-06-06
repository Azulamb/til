class MyTag extends HTMLElement
{
	public static init( tagname = 'clothes-thumbnail' )
	{
		customElements.define( tagname, this );
		// Default style.
		const style = document.createElement( 'style' );
		style.textContent = tagname + '{}'; //CSS
		const rootElement = document.head;
		rootElement.insertBefore( style, rootElement.children[ 0 ] );
	}

	static get observedAttributes() { return []; }

	constructor()
	{
		super();
		const shadow = this.attachShadow( { mode: 'open' } );
	}

	public attributeChangedCallback( name: string, oldValue: any, newValue: string )
	{
	}
}

window.addEventListener( 'DOMContentLoaded', () => { MyTag.init(); } );
