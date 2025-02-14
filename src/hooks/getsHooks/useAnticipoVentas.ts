// 

import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../../api/jezaApi";
import { AnticipoGet } from "../../models/Anticipo";
interface Props {
  cliente: number;
  suc: number;
}
export const useAnticipoVentas = ({ cliente, suc }: Props) => {
  const [dataAnticipos, setAnticipos] = useState<AnticipoGet[]>([]);

  const fetchAnticipos = async () => {
    try {
      const response: AxiosResponse<AnticipoGet[]> = await jezaApi.get(`/Anticipo?id=%&idcia=%&idsuc=${suc}&idnoVenta=%&idCliente=${cliente}&idtipoMovto=%&idformaPago=%&f1=20230101&f2=20230731`);
      setAnticipos(response.data);
      console.log({ dataAnticipos });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAnticipos();
  }, [cliente]);

  return { dataAnticipos, fetchAnticipos, setAnticipos };
};