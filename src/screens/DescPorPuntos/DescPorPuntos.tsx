import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiFillEdit, AiFillDelete } from "react-icons/ai";
import {
  Row,
  Container,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Input,
  Table,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
} from "reactstrap";
import CButton from "../../components/CButton";
import SidebarHorizontal from "../../components/SidebarHorizontal";
import { useNavigate } from "react-router-dom";
import { jezaApi } from "../../api/jezaApi";
import useModalHook from "../../hooks/useModalHook";
import { DescPorPunto } from "../../models/DescPorPunto";
import { useSucursales } from "../../hooks/getsHooks/useSucursales";
import { Sucursal } from "../../models/Sucursal";
import { useFormasPagos } from "../../hooks/getsHooks/useFormasPagos";
import { FormaPago } from "../../models/FormaPago";
import { useAreas } from "../../hooks/getsHooks/useAreas";
import { useDeptos } from "../../hooks/getsHooks/useDeptos";
import { Departamento } from "../../models/Departamento";
import { useCias } from "../../hooks/getsHooks/useCias";
//NUEVAS IMPOTACIONES
import Swal from "sweetalert2";
import { BsBuildingAdd } from "react-icons/bs";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "../../../css/tablaestilos.css";
import { IoIosHome, IoIosRefresh } from "react-icons/io";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { HiBuildingStorefront } from "react-icons/hi2";
import useSeguridad from "../../hooks/getsHooks/useSeguridad";
import { ImGift } from "react-icons/im";

function DescPorPuntos() {
  const { modalActualizar, modalInsertar, setModalInsertar, setModalActualizar, cerrarModalActualizar, cerrarModalInsertar, mostrarModalInsertar } =
    useModalHook();
  const [data, setData] = useState([]);
  const [dataDeptosFiltrado, setDataDeptosFiltrado] = useState<Departamento[]>([]);
  const { dataCias } = useCias();
  const { dataSucursales } = useSucursales();
  const { dataFormasPagos } = useFormasPagos();
  const { dataAreas } = useAreas();
  const { dataDeptos } = useDeptos();

  const [form, setForm] = useState<DescPorPunto>({
    id: 0,
    cia: 0,
    area: 0,
    depto: 0,
    forma_pago: 0,
    sucursal: 0,
    porcentaje_puntos: 0,
  });

  const DataTableHeader = ["Sucursal", "Area", "Departamento", "Forma de pago", "Porcentaje", "acciones"];

  const mostrarModalActualizar = (dato: DescPorPunto) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const editar = (dato: any) => {
    jezaApi
      .put(`/DeptosPuntos`, null, {
        /* <-----------------------------------------------------------------------------------------API EDITAR */
        params: {
          id: form.id,
          cia: form.cia,
          area: form.area,
          depto: form.depto,
          forma_pago: form.forma_pago,
          sucursal: form.sucursal,
          porcentaje_puntos: form.porcentaje_puntos,
        },
      })
      .then(() => {
        getDesucentos();
      })
      .catch((e) => console.log(e));
    const arreglo: any[] = [...data];
    const index = arreglo.findIndex((registro) => registro.id === dato.id);
    if (index !== -1) {
      console.log("index");
      setModalActualizar(false);
    }
  };

  const eliminar = (dato: DescPorPunto) => {
    console.log(dato);
    const opcion = window.confirm(`Estás Seguro que deseas Eliminar el elemento ${dato.id}`);
    if (opcion) {
      jezaApi.delete(`/DeptosPuntos?id=${dato.id}`).then(() => {
        setModalActualizar(false);
        getDesucentos();
      });
    }
  };

  const getDesucentos = () => {
    jezaApi
      .get("/DeptosPuntos?id=0")
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getDesucentos();
  }, []);

  const insertar = () => {
    jezaApi
      .post("/DeptosPuntos", null, {
        params: {
          cia: 1,
          area: 1,
          depto: 1,
          forma_pago: 13,
          sucursal: 1,
          porcentaje_puntos: Number(form.porcentaje_puntos),
        },
      })
      .then((r) => {
        console.log("exitoso");
        console.log(r);
      })
      .catch((e) => console.log(e));
    setModalInsertar(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const quePedo = dataDeptos.filter((data) => data.area === Number(form.area));
    setDataDeptosFiltrado(quePedo);
    console.log({ dataDeptosFiltrado });
  }, [form.area]);

  // Redirige a la ruta "/app"
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/app");
  };
  // Recargar la página actual
  const handleReload = () => {
    window.location.reload();
  };

  // AQUÍ COMIENZA MI COMPONNTE DE GRIDTABLE
  const columns: GridColDef[] = [
    {
      field: "Acción",
      renderCell: (params) => <ComponentChiquito params={params} />,
      flex: 0,
      headerClassName: "custom-header",
    },

    { field: "cia", headerName: "Empresa", flex: 1, headerClassName: "custom-header" },
    { field: "sucursal", headerName: "Sucursal", flex: 1, headerClassName: "custom-header" },
    { field: "area", headerName: "Área", flex: 1, headerClassName: "custom-header" },
    { field: "depto", headerName: "Departamento", flex: 1, headerClassName: "custom-header" },
    { field: "forma_pago", headerName: "Forma de pago", flex: 1, headerClassName: "custom-header" },
    { field: "porcentaje_puntos", headerName: "Porcentaje ", flex: 1, headerClassName: "custom-header" },
  ];

  const ComponentChiquito = ({ params }: { params: any }) => {
    return (
      <>
        <AiFillEdit className="mr-2" onClick={() => mostrarModalActualizar(params.row)} size={23}></AiFillEdit>
        <AiFillDelete color="lightred" onClick={() => eliminar(params.row)} size={23}></AiFillDelete>
        {/* <AiFillDelete color="lightred" onClick={() => console.log(params.row.id)} size={23}></AiFillDelete> */}
      </>
    );
  };

  function DataTable() {
    return (
      <div style={{ height: 300, width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.ID}
            hideFooter={false}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 15 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Row>
        <SidebarHorizontal />
      </Row>
      <Container>
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1> Puntos y recompensas</h1>
          <ImGift size={30} />
        </div>
        <div className="col align-self-start d-flex justify-content-center "></div>
        <br />
        <br />
        <br />
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button
            style={{ marginLeft: "auto" }}
            color="success"
            onClick={() => {
              setModalInsertar(true);
              // setEstado("insert");
              // LimpiezaForm();
            }}
          >
            Crear recompensa
          </Button>

          <Button color="primary" onClick={handleRedirect}>
            <IoIosHome size={20}></IoIosHome>
          </Button>
          <Button onClick={handleReload}>
            <IoIosRefresh size={20}></IoIosRefresh>
          </Button>
        </ButtonGroup>

        <br />
        <br />
        <br />
        <DataTable></DataTable>
      </Container>

      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div>
            <h3>Editar recompensa</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Sucursal:</Label>
            <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
              <option value="">Seleccione sucursal</option>
              {dataSucursales.map((sucursal) => (
                <option key={sucursal.sucursal} value={sucursal.sucursal}>
                  {sucursal.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>

          <Label for="area">Área:</Label>
          <Input type="select" name="area" id="area" onChange={handleChange}>
            <option value={0}>Seleccione un área</option>
            {dataAreas.map((area) => (
              <option value={area.area}>{area.descripcion}</option>
            ))}{" "}
          </Input>
          <br />
          <FormGroup>
            <Label for="departamento">Departamento:</Label>
            <Input type="select" name="depto" id="depto" onChange={handleChange}>
              <option value={0}>Seleccione un departamento</option>
              {dataDeptosFiltrado.map((depto) => (
                <option value={depto.depto}>{depto.descripcion}</option>
              ))}{" "}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="formaPago">Forma de pago:</Label>
            <Input type="select" name="formaPago" id="formaPago" onChange={handleChange}>
              {/* Opciones de forma de pago */}
              {dataFormasPagos.map((formaPago: FormaPago) => (
                <option value={formaPago.tipo}> {formaPago.descripcion} </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="Porcentaje">Porcentaje:</Label>
            <Input type="number" name="porcentaje_puntos" id="Porcentaje" onChange={handleChange} />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              editar(form);
              getDesucentos();
            }}
            text="Actualizar"
          />
          <CButton color="danger" onClick={() => cerrarModalActualizar()} text="Cancelar" />
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar} about="">
        <ModalHeader>
          <div>
            <h3>Crear recompensa</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Sucursal:</Label>
            <Input type="select" name="sucursal" id="exampleSelect" value={form.sucursal} onChange={handleChange}>
              <option value="">Seleccione sucursal</option>
              {dataSucursales.map((sucursal) => (
                <option key={sucursal.sucursal} value={sucursal.sucursal}>
                  {sucursal.nombre}
                </option>
              ))}
            </Input>
          </FormGroup>

          <Label for="area">Área:</Label>
          <Input type="select" name="area" id="area" onChange={handleChange}>
            <option value={0}>Seleccione un área</option>
            {dataAreas.map((area) => (
              <option value={area.area}>{area.descripcion}</option>
            ))}{" "}
          </Input>
          <br />
          <FormGroup>
            <Label for="departamento">Departamento:</Label>
            <Input type="select" name="depto" id="depto" onChange={handleChange}>
              <option value={0}>Seleccione un departamento</option>
              {dataDeptosFiltrado.map((depto) => (
                <option value={depto.depto}>{depto.descripcion}</option>
              ))}{" "}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="formaPago">Forma de pago:</Label>
            <Input type="select" name="formaPago" id="formaPago" onChange={handleChange}>
              {/* Opciones de forma de pago */}
              {dataFormasPagos.map((formaPago: FormaPago) => (
                <option value={formaPago.tipo}> {formaPago.descripcion} </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="Porcentaje">Porcentaje:</Label>
            <Input type="number" name="porcentaje_puntos" id="Porcentaje" onChange={handleChange} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <CButton color="success" onClick={() => insertar()} text="Guardar recompensa" />
          <CButton color="btn btn-danger" onClick={() => cerrarModalInsertar()} text="Cancelar" />
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DescPorPuntos;
