<script lang="ts">
  /**
   * DoubleThumbsUp Component
   *
   * @component
   * @description An SVG icon component that renders a double thumbs up graphic with sophisticated
   * styling and animation-ready structure. Features a complex SVG with multiple paths, masks,
   * and filters to create a detailed double thumbs up illustration. The icon uses currentColor
   * for theme compatibility and includes a 2.5x scale transform for enhanced visibility. Built
   * from Lottie animation data and optimized for web display with proper aspect ratio preservation
   * and responsive sizing capabilities.
   *
   * @prop {string} [className=""] - CSS class name to apply to the SVG element for custom styling
   * @prop {string} [width="24"] - Width of the SVG icon in pixels or other CSS units
   * @prop {string} [height="24"] - Height of the SVG icon in pixels or other CSS units
   */

  /**
   * Props for the DoubleThumbsUp component
   *
   * @interface {Object} DoubleThumbsUpProps
   * @property {string} [className] - CSS class for custom styling and theme integration
   * @property {string} [width] - Icon width dimension for responsive sizing
   * @property {string} [height] - Icon height dimension for responsive sizing
   */
  interface DoubleThumbsUpProps {
    className?: string;
    width?: string;
    height?: string;
  }

  export let className: DoubleThumbsUpProps['className'] = '';
  export let width: DoubleThumbsUpProps['width'] = '24';
  export let height: DoubleThumbsUpProps['height'] = '24';

  /**
   * Complex SVG string with double thumbs up graphic
   *
   * @constant {string} svgString
   * @description Pre-built SVG markup containing the complete double thumbs up icon with
   * advanced features including clip paths, masks, filters, and multiple path elements.
   * The SVG uses currentColor for fill and stroke properties to ensure theme compatibility
   * and includes a 2.5x scale transform for enhanced visual impact. Originally derived
   * from Lottie animation data and optimized for static display with preserved aspect
   * ratio and responsive dimensions.
   *
   * @example
   *  The SVG includes these key features:
   *  - Multiple clip paths for precise shape definition
   *  - Alpha masks for complex layering effects
   *  - currentColor usage for theme integration
   *  - 2.5x scale transform for enhanced visibility
   *  - Responsive width/height from props
   */
  const svgString = `<svg 
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 72 72" 
    width="${width}" 
    height="${height}" 
    preserveAspectRatio="xMidYMid meet"
    class="${className}"
    style="transform: scale(2.5); transform-origin: center;"
    role="img"
    aria-label="Double thumbs up icon"
  >
    <defs>
      <clipPath id="__lottie_element_97">
        <rect width="72" height="72" x="0" y="0"></rect>
      </clipPath>
      <clipPath id="__lottie_element_99">
        <path d="M0,0 L410,0 L410,410 L0,410z"></path>
      </clipPath>
      <g id="__lottie_element_123">
        <g style="display: block;" transform="matrix(1,0,0,1,31.5,37.03200149536133)" opacity="1">
          <g opacity="1" transform="matrix(1,0,0,1,0,0)">
            <path fill="currentColor" fill-opacity="1" d=" M7.400000095367432,5.539999961853027 C7.388999938964844,5.567999839782715 7.376999855041504,5.59499979019165 7.364999771118164,5.622000217437744 M-7.275000095367432,-0.2070000022649765 C-7.275000095367432,-0.2070000022649765 -7.823999881744385,-2.130000114440918 -7.823999881744385,-2.130000114440918 M-3.75,8 C-3.75,8 -4.742000102996826,9.736000061035156 -4.742000102996826,9.736000061035156 M-4.742000102996826,9.736000061035156 C-4.742000102996826,9.736000061035156 -4.914999961853027,9.637999534606934 -4.914999961853027,9.637999534606934 C-5.645999908447266,9.220000267028809 -6.473999977111816,9 -7.315999984741211,9 C-8.79800033569336,9 -10,7.797999858856201 -10,6.315999984741211 C-10,6.315999984741211 -10,0.7540000081062317 -10,0.7540000081062317 C-10,-0.5849999785423279 -9.112000465393066,-1.7619999647140503 -7.823999881744385,-2.130000114440918 C-7.823999881744385,-2.130000114440918 -5.789000034332275,-2.7119998931884766 -5.789000034332275,-2.7119998931884766 C-5.789000034332275,-2.7119998931884766 -4,-5.573999881744385 -4,-5.573999881744385 C-4,-5.573999881744385 -4,-8.52400016784668 -4,-8.52400016784668 C-4,-9.892000198364258 -2.8919999599456787,-11 -1.5240000486373901,-11 C0.9259999990463257,-11 2.99399995803833,-9.175000190734863 3.2980000972747803,-6.74399995803833 C3.2980000972747803,-6.74399995803833 3.375999927520752,-6.116000175476074 3.375999927520752,-6.116000175476074 C3.4639999866485596,-5.413000106811523 3.4579999446868896,-4.701000213623047 3.3589999675750732,-4 C3.3589999675750732,-4 5.5,-4 5.5,-4 C7.433000087738037,-4 9,-2.433000087738037 9,-0.5 C9,-0.40299999713897705 8.996000289916992,-0.3059999942779541 8.98799991607666,-0.210999995470047 C9.61400032043457,0.42100000381469727 10,1.2899999618530273 10,2.25 C10,2.9719998836517334 9.781999588012695,3.6419999599456787 9.407999992370605,4.198999881744385 C9.468000411987305,4.455999851226807 9.5,4.723999977111816 9.5,5 C9.5,6.198999881744385 8.89799976348877,7.25600004196167 7.979000091552734,7.88700008392334 C7.785999774932861,9.637999534606934 6.302000045776367,11 4.5,11 C4.5,11 0.01600000075995922,11 0.01600000075995922,11 C-1.652999997138977,11 -3.2929999828338623,10.564000129699707 -4.742000102996826,9.736000061035156z"></path>
          </g>
        </g>
      </g>
      <filter id="__lottie_element_129" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
        <feComponentTransfer in="SourceGraphic">
          <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
        </feComponentTransfer>
      </filter>
      <mask id="__lottie_element_123_2" mask-type="alpha">
        <g filter="url(#__lottie_element_129)">
          <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
          <use xlink:href="#__lottie_element_123"></use>
        </g>
      </mask>
      <g id="__lottie_element_133">
        <g style="display: none;">
          <g>
            <path></path>
          </g>
        </g>
      </g>
      <filter id="__lottie_element_139" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
        <feComponentTransfer in="SourceGraphic">
          <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
        </feComponentTransfer>
      </filter>
      <mask id="__lottie_element_133_2" mask-type="alpha">
        <g filter="url(#__lottie_element_139)">
          <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
          <use xlink:href="#__lottie_element_133"></use>
        </g>
      </mask>
      <g id="__lottie_element_143">
        <g style="display: block;" transform="matrix(1,0,0,1,32.3120002746582,37.345001220703125)" opacity="1">
          <g opacity="1" transform="matrix(1,0,0,1,0,0)">
            <path fill="currentColor" fill-opacity="1" d=" M-2.75,-12 C-2.75,-12 -1.4119999408721924,-12 -1.4119999408721924,-12 C1.121000051498413,-12 3.6019999980926514,-10.359000205993652 4.250999927520752,-7.60699987411499 C4.423999786376953,-6.870999813079834 4.614999771118164,-5.929999828338623 4.702000141143799,-4.98199987411499 C7.426000118255615,-4.760000228881836 9.588000297546387,-2.553999900817871 9.741000175476074,0.1889999955892563 C10.067000389099121,0.8930000066757202 10.25,1.6770000457763672 10.25,2.5 C10.25,3.3239998817443848 10.067000389099121,4.10699987411499 9.741000175476074,4.810999870300293 C9.675999641418457,5.9770002365112305 9.246999740600586,7.046000003814697 8.569000244140625,7.90500020980835 C7.947999954223633,10.26200008392334 5.802000045776367,12 3.25,12 C3.25,12 -0.34599998593330383,12 -0.34599998593330383,12 C-2.007999897003174,12 -3.6540000438690186,11.661999702453613 -5.182000160217285,11.006999969482422 C-5.182000160217285,11.006999969482422 -6.005000114440918,10.654999732971191 -6.005000114440918,10.654999732971191 C-6.243000030517578,10.553000450134277 -6.5,10.5 -6.758999824523926,10.5 C-8.687000274658203,10.5 -10.25,8.937000274658203 -10.25,7.008999824523926 C-10.25,7.008999824523926 -10.25,1.6180000305175781 -10.25,1.6180000305175781 C-10.25,0.10300000011920929 -9.394000053405762,-1.281999945640564 -8.038999557495117,-1.9600000381469727 C-8.038999557495117,-1.9600000381469727 -7.486000061035156,-2.2360000610351562 -7.486000061035156,-2.2360000610351562 C-7.486000061035156,-2.2360000610351562 -6.25,-4.708000183105469 -6.25,-4.708000183105469 C-6.25,-4.708000183105469 -6.25,-8.5 -6.25,-8.5 C-6.25,-10.432999610900879 -4.683000087738037,-12 -2.75,-12z"></path>
          </g>
        </g>
      </g>
      <filter id="__lottie_element_149" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
        <feComponentTransfer in="SourceGraphic">
          <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
        </feComponentTransfer>
      </filter>
      <mask id="__lottie_element_143_2" mask-type="alpha">
        <g filter="url(#__lottie_element_149)">
          <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
          <use xlink:href="#__lottie_element_143"></use>
        </g>
      </mask>
      <g id="__lottie_element_153">
        <g style="display: none;">
          <g>
            <path></path>
          </g>
        </g>
      </g>
      <filter id="__lottie_element_159" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
        <feComponentTransfer in="SourceGraphic">
          <feFuncA type="table" tableValues="1.0 0.0"></feFuncA>
        </feComponentTransfer>
      </filter>
      <mask id="__lottie_element_153_2" mask-type="alpha">
        <g filter="url(#__lottie_element_159)">
          <rect width="72" height="72" x="0" y="0" fill="#ffffff" opacity="0"></rect>
          <use xlink:href="#__lottie_element_153"></use>
        </g>
      </mask>
    </defs>
    <g clip-path="url(#__lottie_element_97)">
      <g style="display: none;" mask="url(#__lottie_element_153_2)">
        <g>
          <g>
            <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"></path>
          </g>
        </g>
      </g>
      <g style="display: none;">
        <g>
          <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"></path>
        </g>
      </g>
      <g style="display: block;" mask="url(#__lottie_element_143_2)">
        <g transform="matrix(1,0,0,1,39.81199645996094,33.90599822998047)" opacity="1">
          <g opacity="1" transform="matrix(1,0,0,1,0,0)">
            <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="currentColor" stroke-opacity="1" stroke-width="2" d=" M-2.75,-9 C-2.75,-9 -1.4119999408721924,-9 -1.4119999408721924,-9 C-0.12099999934434891,-9 1.034999966621399,-8.175000190734863 1.3309999704360962,-6.918000221252441 C1.5509999990463257,-5.982999801635742 1.75,-4.892000198364258 1.75,-4 C1.75,-3.305000066757202 1.628999948501587,-2.6110000610351562 1.472000002861023,-2 C1.472000002861023,-2 4.25,-2 4.25,-2 C5.63100004196167,-2 6.75,-0.8809999823570251 6.75,0.5 C6.75,0.652999997138977 6.736000061035156,0.8029999732971191 6.710000038146973,0.9480000138282776 C7.047999858856201,1.3739999532699585 7.25,1.9140000343322754 7.25,2.5 C7.25,3.0859999656677246 7.047999858856201,3.625999927520752 6.710000038146973,4.052000045776367 C6.736000061035156,4.197000026702881 6.75,4.3470001220703125 6.75,4.5 C6.75,5.317999839782715 6.35699987411499,6.044000148773193 5.75,6.5 C5.75,7.88100004196167 4.63100004196167,9 3.25,9 C3.25,9 -0.34599998593330383,9 -0.34599998593330383,9 C-1.6019999980926514,9 -2.8450000286102295,8.744999885559082 -4,8.25 C-4,8.25 -4.822999954223633,7.896999835968018 -4.822999954223633,7.896999835968018 C-5.434999942779541,7.635000228881836 -6.093999862670898,7.5 -6.758999824523926,7.5 C-7.03000020980835,7.5 -7.25,7.28000020980835 -7.25,7.008999824523926 C-7.25,7.008999824523926 -7.25,1.6180000305175781 -7.25,1.6180000305175781 C-7.25,1.2389999628067017 -7.035999774932861,0.8930000066757202 -6.697000026702881,0.7239999771118164 C-6.697000026702881,0.7239999771118164 -5.8460001945495605,0.2980000078678131 -5.8460001945495605,0.2980000078678131 C-5.459000110626221,0.10400000214576721 -5.145999908447266,-0.20900000631809235 -4.952000141143799,-0.5960000157356262 C-4.952000141143799,-0.5960000157356262 -3.3559999465942383,-3.7890000343322754 -3.3559999465942383,-3.7890000343322754 C-3.2869999408721924,-3.927999973297119 -3.25,-4.080999851226807 -3.25,-4.236000061035156 C-3.25,-4.236000061035156 -3.25,-8.5 -3.25,-8.5 C-3.25,-8.776000022888184 -3.0260000228881836,-9 -2.75,-9z"></path>
          </g>
        </g>
      </g>
      <g style="display: block;" transform="matrix(1,0,0,1,32.3120002746582,37.90700149536133)" opacity="1">
        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
          <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="currentColor" stroke-opacity="1" stroke-width="2" d=" M-2.75,-9 C-2.75,-9 -1.4119999408721924,-9 -1.4119999408721924,-9 C-0.12099999934434891,-9 1.034999966621399,-8.175000190734863 1.3309999704360962,-6.918000221252441 C1.5509999990463257,-5.982999801635742 1.75,-4.892000198364258 1.75,-4 C1.75,-3.305000066757202 1.628999948501587,-2.6110000610351562 1.472000002861023,-2 C1.472000002861023,-2 4.25,-2 4.25,-2 C5.63100004196167,-2 6.75,-0.8809999823570251 6.75,0.5 C6.75,0.652999997138977 6.736000061035156,0.8029999732971191 6.710000038146973,0.9480000138282776 C7.047999858856201,1.3739999532699585 7.25,1.9140000343322754 7.25,2.5 C7.25,3.0859999656677246 7.047999858856201,3.625999927520752 6.710000038146973,4.052000045776367 C6.736000061035156,4.197000026702881 6.75,4.3470001220703125 6.75,4.5 C6.75,5.317999839782715 6.35699987411499,6.044000148773193 5.75,6.5 C5.75,7.88100004196167 4.63100004196167,9 3.25,9 C3.25,9 -0.34599998593330383,9 -0.34599998593330383,9 C-1.6019999980926514,9 -2.8450000286102295,8.744999885559082 -4,8.25 C-4,8.25 -4.822999954223633,7.896999835968018 -4.822999954223633,7.896999835968018 C-5.434999942779541,7.635000228881836 -6.093999862670898,7.5 -6.758999824523926,7.5 C-7.03000020980835,7.5 -7.25,7.28000020980835 -7.25,7.008999824523926 C-7.25,7.008999824523926 -7.25,1.6180000305175781 -7.25,1.6180000305175781 C-7.25,1.2389999628067017 -7.035999774932861,0.8930000066757202 -6.697000026702881,0.7239999771118164 C-6.697000026702881,0.7239999771118164 -5.8460001945495605,0.2980000078678131 -5.8460001945495605,0.2980000078678131 C-5.459000110626221,0.10400000214576721 -5.145999908447266,-0.20900000631809235 -4.952000141143799,-0.5960000157356262 C-4.952000141143799,-0.5960000157356262 -3.3559999465942383,-3.7890000343322754 -3.3559999465942383,-3.7890000343322754 C-3.2869999408721924,-3.927999973297119 -3.25,-4.080999851226807 -3.25,-4.236000061035156 C-3.25,-4.236000061035156 -3.25,-8.5 -3.25,-8.5 C-3.25,-8.776000022888184 -3.0260000228881836,-9 -2.75,-9z"></path>
        </g>
      </g>
    </g>
  </svg>`;
</script>

<!-- 
  Double thumbs up icon with responsive sizing and theme integration
  
  @example
  // Basic usage with default size
  <DoubleThumbsUp />
  
  @example
  // Custom size and styling
  <DoubleThumbsUp width="32" height="32" className="text-green-500" />
  
  @example
  // Large size for emphasis
  <DoubleThumbsUp width="48" height="48" className="rating-icon--large" />
-->
{@html svgString}
