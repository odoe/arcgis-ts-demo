import Accessor from '@arcgis/core/core/Accessor';

import Collection from '@arcgis/core/core/Collection';

import config from '@arcgis/core/config';
import ArcGISMap from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import { whenOnce } from '@arcgis/core/core/watchUtils';

import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SizeVariable from '@arcgis/core/renderers/visualVariables/SizeVariable';

import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';

const renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    color: [0, 0, 0, 0],
    outline: {
      color: '#71de6e',
      width: 1
    }
  }),
  visualVariables: [
    new SizeVariable({
      field: 'POP_POVERTY',
      normalizationField: 'TOTPOP_CY',
      legendOptions: {
        title: '% population in poverty by county'
      },
      stops: [
        {
          value: 0.15,
          size: 4,
          label: '<15%'
        },
        {
          value: 0.25,
          size: 12,
          label: '25%'
        },
        {
          value: 0.35,
          size: 20,
          label: '>35%'
        }
      ]
    })
  ]
});

@subclass('app.App')
export default class App extends Accessor {
  constructor(props?: Partial<Pick<App, 'apiKey'>>) {
    super(props);
    whenOnce(this, 'apiKey', this._init.bind(this))
  }

  _layerViews: Collection<FeatureLayerView> = new Collection();

  @property()
  apiKey!: string;

  @property()
  get loaded(): boolean {
    return this.view?.ready;
  }

  @property()
  get layerViews(): Collection<FeatureLayerView> {
    return this._layerViews;
  }

  @property()
  get status(): string {
    return this.loaded ? 'ready' : 'pending';
  }

  @property()
  view!: MapView;

  // private methods
  private async _init() {
    config.apiKey = this.apiKey;

    const layer = new FeatureLayer({
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/counties_politics_poverty/FeatureServer/0",
      renderer,
      title: "Poverty in the southeast U.S.",
      popupTemplate: {
        // autocasts as new PopupTemplate()
        title: "{COUNTY}, {STATE}",
        content:
          "{POP_POVERTY} of {TOTPOP_CY} people live below the poverty line.",
        fieldInfos: [
          {
            fieldName: "POP_POVERTY",
            format: {
              digitSeparator: true,
              places: 0
            }
          },
          {
            fieldName: "TOTPOP_CY",
            format: {
              digitSeparator: true,
              places: 0
            }
          }
        ]
      }
    });

    const map = new ArcGISMap({
      basemap: 'arcgis-nova',
      layers: [layer]
    });

    this.view = new MapView({
      container: 'viewDiv',
      map: map,
      center: [-85.0502, 33.125524],
      zoom: 5
    });

    const layerView = await this.view.whenLayerView(layer);
    this.layerViews.add(layerView);
  }
}