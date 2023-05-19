import "./css/index.scss";
import '@fortawesome/fontawesome-free/js/all'
import '@popperjs/core'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';

import {create_graph, setup_controls} from "./graph";
import {setup_search_event} from "./search";
import logoImageSrc from '../assets/_66dfdbf1-0b1a-465f-8b9a-53e910b619bc.jpg';


const logoImage = document.getElementById('logoImage')! as HTMLImageElement;
logoImage.src = logoImageSrc;
logoImage.height = 50;
logoImage.width = 50;

const orb = create_graph();

// var all_nodes = orb.data.getNodes();
setup_search_event(orb);
setup_controls(orb);
const element = document.getElementById('welcome-modal') as HTMLElement;
const myModal = new Modal(element);
myModal.show();


