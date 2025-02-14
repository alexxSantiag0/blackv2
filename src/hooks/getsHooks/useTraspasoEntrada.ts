import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { TraspasoGet } from "../../models/Traspaso";
interface Props {
  sucursal: string | number;
}
export const useTraspasoEntrada = ({ sucursal }: Props) => {
  const [dataTraspasosEntradas, setDataTraspasosEntradas] = useState<TraspasoGet[]>([]);

  const fetchTraspasosEntradas = async () => {
    try {
      const response: AxiosResponse<TraspasoGet[]> = await jezaApi.get(
        `/Traspaso?id=%&folio=%&sucursal=21&sucursal_destino=${sucursal}&claveprod=%&f1=20230625&f2=20230928`
      );
      setDataTraspasosEntradas(response.data);
      console.log(dataTraspasosEntradas);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTraspasosEntradas();
  }, [sucursal]);

  return { dataTraspasosEntradas, fetchTraspasosEntradas };
};
