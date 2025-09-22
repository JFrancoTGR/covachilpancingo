// === google-maps-lazy.js ===

const mapStyles = [
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.icon',
    stylers: [
      {
        color: '#d3f290ff',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ea3229',
      },
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#c6c6c6',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a6a434',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.icon',
    stylers: [
      {
        color: '#8fafdc',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#868a63',
      },
    ],
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#56593c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#9ad3ef',
      },
    ],
  },
];

function initSelector() {
  const toggles = document.querySelectorAll('.js-category-open');

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const submenu = toggle.nextElementSibling;

      if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
        toggle.classList.remove('active');
      } else {
        document
          .querySelectorAll('.category-selector__hide')
          .forEach((el) => (el.style.display = 'none'));
        document
          .querySelectorAll('.js-category-open')
          .forEach((el) => el.classList.remove('active'));
        submenu.style.display = 'block';
        toggle.classList.add('active');
      }
    });
  });

  document.querySelector('.js-selector-open')?.addEventListener('click', () => {
    document.querySelector('.category-selector')?.classList.add('active');
  });

  document
    .querySelector('.js-selector-close')
    ?.addEventListener('click', () => {
      document.querySelector('.category-selector')?.classList.remove('active');
    });
}

function initMap() {
  const markerIcons = {
    entertainment: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#ef9361',
      fillOpacity: 1,
      strokeWeight: 5,
      strokeColor: '#fff',
      scale: 15,
    },
    wellness: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#6ac7b3',
      fillOpacity: 1,
      strokeWeight: 5,
      strokeColor: '#fff',
      scale: 15,
    },
    index: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#56c7c1',
      fillOpacity: 1,
      strokeWeight: 5,
      strokeColor: '#fff',
      scale: 15,
    },
  };

  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 19.407404, lng: -99.1694269 },
    zoom: 19,
    mapTypeControl: false,
    styles: mapStyles,
  });

  const locations = [
    // COVA
    {
      idName: 'cova',
      name: 'COVA',
      lat: 19.407404,
      lng: -99.1694269,
      category: 'index',
    },

    // Food & Drinks
    {
      idName: 'castizo',
      name: 'Castizo',
      lat: 19.4079687,
      lng: -99.1697685,
      category: 'entertainment',
    },
    {
      idName: 'roberta-trattoria',
      name: 'Roberta Trattoria',
      lat: 19.4073492,
      lng: -99.1739004,
      category: 'entertainment',
    },
    {
      idName: 'hookah-lounge',
      name: 'Hookah Lounge',
      lat: 19.4087299,
      lng: -99.1726218,
      category: 'entertainment',
    },
    {
      idName: 'mendl-delicatessen',
      name: 'Mendl Delicatessen',
      lat: 19.4101464,
      lng: -99.1738896,
      category: 'entertainment',
    },
    {
      idName: 'patagonia',
      name: 'Patagonia',
      lat: 19.4093732,
      lng: -99.1761733,
      category: 'entertainment',
    },
    {
      idName: 'maque-condesa',
      name: 'Maque Condesa',
      lat: 19.4103983,
      lng: -99.1736976,
      category: 'entertainment',
    },
    {
      idName: 'caiman-bar',
      name: 'Caimán Bar',
      lat: 19.4106158,
      lng: -99.1751042,
      category: 'entertainment',
    },
    {
      idName: 'pescadito-roma',
      name: 'El Pescadito Roma',
      lat: 19.4092622,
      lng: -99.1695886,
      category: 'entertainment',
    },
    {
      idName: 'central-roma',
      name: 'Central Roma Sur',
      lat: 19.4075769,
      lng: -99.1703105,
      category: 'entertainment',
    },
    {
      idName: 'parque-mexico',
      name: 'Parque México',
      lat: 19.4122631,
      lng: -99.1695776,
      category: 'entertainment',
    },

    // Wellness
    {
      idName: 'cova-nuevo-leon',
      name: 'COVA Nuevo León',
      lat: 19.4044066,
      lng: -99.171664,
      category: 'wellness',
    },
    {
      idName: 'andaz-condesa',
      name: 'Andaz Condesa',
      lat: 19.4078574,
      lng: -99.1715997,
      category: 'wellness',
    },
    {
      idName: 'hospital-angeles',
      name: 'Hospital Ángeles Metropolitano',
      lat: 19.4067086,
      lng: -99.1667742,
      category: 'wellness',
    },
    {
      idName: 'medica-dalinde',
      name: 'Torre Médica Dalinde',
      lat: 19.4054484,
      lng: -99.1704345,
      category: 'wellness',
    },
    {
      idName: 'commando-condesa',
      name: 'COMMANDO Condesa',
      lat: 19.4134135,
      lng: -99.1679384,
      category: 'wellness',
    },
    {
      idName: 'mukta-yoga',
      name: 'Mukta Yoga',
      lat: 19.4097124,
      lng: -99.1745061,
      category: 'wellness',
    },
  ];

  const markers = {};
locations.forEach((loc) => {
  const isWavve = loc.idName === 'cova';

  const marker = new google.maps.Marker({
    position: { lat: loc.lat, lng: loc.lng },
    map,
    title: loc.name,
    icon: isWavve
      ? {
          url: 'assets/ico/ico-pin-map.svg', // Ruta a tu SVG
          scaledSize: new google.maps.Size(35, 35),   // Tamaño del ícono
          anchor: new google.maps.Point(24, 48),      // Ancla al centro base
        }
      : markerIcons[loc.category] || null,
  });

  markers[loc.idName] = marker;
});


  document.querySelector('.js-all')?.addEventListener('click', () => {
    document
      .querySelectorAll('[data-zone]')
      .forEach((el) => el.classList.remove('active'));
    map.setZoom(16);
    map.panTo({ lat: 19.407404, lng: -99.1694269 });
  });

  document.querySelectorAll('[data-zone]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-zone');
      document
        .querySelectorAll('[data-zone]')
        .forEach((el) => el.classList.remove('active'));
      btn.classList.add('active');
      if (markers[id]) {
        map.panTo(markers[id].getPosition());
        map.setZoom(19);
      }
    });
  });

  initSelector();
}

const observer = new IntersectionObserver(
  (entries, obs) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/google-maps.css';
    document.head.appendChild(link);
    if (entries[0].isIntersecting) {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=MI_API_KEY&callback=initMap&loading=async';
      script.async = true;
      window.initMap = initMap;
      document.head.appendChild(script);
      obs.disconnect();
    }
  },
  { threshold: 0.01 }
);

const mapWrapper = document.querySelector('#location');
if (mapWrapper) {
  observer.observe(mapWrapper);
}
