import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  FlatList,
  TouchableOpacity
} from 'react-native';
import moment from "moment"

import DateTimePicker from "react-native-modal-datetime-picker";
import axios from "axios";
export default class Orgaoscreen extends React.Component {
  static navigationOptions = {
    title: 'Cadastro de Orgao',
  };

  constructor(props) {
    super(props);
    let codigo = props.navigation.getParam('codigo');
    this.state = {
      isLoading: false,
      codigo: codigo,
      pessoas: [],
      isDateTimePickerInicialVisible: false,
      isDateTimePickerFinalVisible: false,
      dataInicial: moment().format('DD/MM/YYYY'),
      dataFinal: moment().format('DD/MM/YYYY'),
      pagina: 1,
      msg: null,
      errorData: false

    };
    console.log(!this.state.isLoading && this.state.pessoas.length == 0 && this.state.pagina == 1)
  }

  showDateTimePickerInicial = () => {
    this.setState({ isDateTimePickerInicialVisible: true });
  };

  hideDateTimePickerInicial = () => {
    this.setState({ isDateTimePickerInicialVisible: false });

  };

  handleDatePickedInicial = date => {
    let dataIni = moment(date).format('DD/MM/YYYY')
    this.setState({
      dataInicial: dataIni
    })
    this.hideDateTimePickerInicial();
  };

  showDateTimePickerFinal = () => {
    this.setState({ isDateTimePickerFinalVisible: true });
  };

  hideDateTimePickerFinal = () => {
    this.setState({ isDateTimePickerFinalVisible: false });
  };

  handleDatePickedFinal = date => {
    let dateFim = moment(date).format('DD/MM/YYYY')
    this.setState({
      dataFinal: dateFim
    })
    this.hideDateTimePickerFinal();
  };

  handleSeach() {
    const { codigo, dataInicial, dataFinal } = this.state;
    let dateInit = moment(dataInicial,'DD/MM/YYYY');
    let dateFim = moment(dataFinal,'DD/MM/YYYY');
    let diff = moment.duration( dateFim - dateInit , 'milliseconds');
    let diffDay = dateInit.diff(dateFim, 'month')
    let msg = '';
    if (dateFim < dateInit) {
      msg = "Data inicial nao pode ser menor que a data final"
      this.setState({
        msg,
        errorData: true
      });
        return ;
    } else if ((diffDay < 0) || (diffDay > 0)) {
      msg = "Selecione um perido maximo de ate 30 dias"
      this.setState({
        msg,
        errorData: true

      });
      return ;

    } else {

      axios.get('http://www.transparencia.gov.br/api-de-dados/viagens', {
        params: {
          dataIdaDe: dataInicial,
          dataIdaAte: dataFinal,
          dataRetornoDe: dataInicial,
          dataRetornoAte: dataFinal,
          codigoOrgao: codigo,
          pagina: 1
        }
      }).then((res, req) => {
        console.log(res)

        if (res.data.length == 0) {
          this.setState({
            isLoading: false,
            // Orgaos: responseJson,
            pessoas: [],
            msg: 'Sem registro',
            errorData: false
          })

        } else {
          this.setState({
            isLoading: false,
            // Orgaos: responseJson,
            pessoas: res.data,
            pagina: 1,
            errorData: false

          })
        }
      }).catch((error) => {
        console.log(error)
        this.setState({
          isLoading: false,
          pessoas: [],
          errorData:false
        });
      });
      this.setState({
        isLoading: true,
        pessoas: [],
        errorData:false

      })

    }
  }

  handleNextPage() {
    const { codigo, dataInicial, dataFinal, pagina } = this.state;
    let pag = pagina;
    let pageInit = pagina;
    pag++;
    axios.get('http://www.transparencia.gov.br/api-de-dados/viagens', {
      params: {
        dataIdaDe: dataInicial,
        dataIdaAte: dataFinal,
        dataRetornoDe: dataInicial,
        dataRetornoAte: dataFinal,
        codigoOrgao: codigo,
        pagina: pag
      }
    }).then((res, req) => {
      if (res.data.length == 0) {
        this.setState({
          isLoading: false,
          // Orgaos: responseJson,
          pagina: pag,
          pessoas: [],
          msg: 'Sem registro nesta pagina'
        })
      } else {
        console.log(res)
        this.setState({
          isLoading: false,
          // Orgaos: responseJson,
          pessoas: res.data,
          pagina: pagina
        })
      }
    }).catch((error) => {
      console.log(error)

      this.setState({
        isLoading: false,
        // Orgaos: responseJson,
        pagina: pageInit,
        pessoas: [],
      });
    });
    this.setState({
      isLoading: true,
      // Orgaos: responseJson,
      pessoas: [],
    })


  }


  handleLastPage() {
    const { codigo, dataInicial, dataFinal, pagina } = this.state;
    let pag = pagina;
    let pageInit = pagina;
    if (pag > 1) {
      pag--;
    }
    console.log('teste', this.state)

    axios.get('http://www.transparencia.gov.br/api-de-dados/viagens', {
      params: {
        dataIdaDe: dataInicial,
        dataIdaAte: dataFinal,
        dataRetornoDe: dataInicial,
        dataRetornoAte: dataFinal,
        codigoOrgao: codigo,
        pagina: pag
      }
    }).then((res, req) => {
      this.setState({
        isLoading: false,
        // Orgaos: responseJson,
        pessoas: res.data,
        pagina: pag
      })
    }).catch((error) => {
      this.setState({
        isLoading: false,
        // Orgaos: responseJson,,
        pagina: pageInit,
        pessoas: [],
      });
    });
    this.setState({
      isLoading: true,
      // Orgaos: responseJson,
      pessoas: [],
    })


  }

  handleVerifyDate() {
    // let dateInit = moment(this.state.dataInicial).valueOf();
    // let dateFim = moment(this.state.dataFinal).valueOf();
    // let diff = dateInit - dateFim;
    // let diffDay = moment.duration(diff)
    // let msg1 = '';
    let teste = false;
    if (dateFim < dateInit) {
      msg1 = "Data inicial nao pode ser menor que a data final"
      teste = true;
      this.setState({
        msg1
      });

    } else if (diffDay > 30 || diffDay < -30) {
      msg1 = "Selecione um perido maximo de 30 dias"
      teste = true;
      this.setState({
        msg1
      });
    }



    return teste;
  }

  render() {
    const { navigate } = this.props.navigation;
    const { codigo, dataInicial, dataFinal } = this.state;

    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }
    if (!this.state.isLoading && this.state.errorData) {
      return (
        <View style={styles.container}>
          <Button title="Voltar" onPress={() => navigate('Orgaos')} />
          <Text>{dataInicial}</Text>

          <Button title="data inicial da pesquisa" onPress={this.showDateTimePickerInicial} />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerInicialVisible}
            onConfirm={this.handleDatePickedInicial}
            onCancel={this.hideDateTimePickerFinal}
            mode={"date"}
          />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerFinalVisible}
            onConfirm={this.handleDatePickedFinal}
            onCancel={this.hideDateTimePickerFinal}
            mode={"date"}
          />
          <Text>{dataFinal}</Text>
          <Button title="data final da pesquisa" onPress={this.showDateTimePickerFinal} />
          <Button title="Busca" onPress={() => this.handleSeach()} />
          <Text>{this.state.msg}</Text>
        </View>
      );
    }

    if (!this.state.isLoading && this.state.pessoas.length == 0 && this.state.pagina == 1) {
      return (
        <View style={styles.container}>
          <Button title="Voltar" onPress={() => navigate('Orgaos')} />
          <Text>{dataInicial}</Text>

          <Button title="data inicial da pesquisa" onPress={this.showDateTimePickerInicial} />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerInicialVisible}
            onConfirm={this.handleDatePickedInicial}
            onCancel={this.hideDateTimePickerFinal}
            mode={"date"}
          />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerFinalVisible}
            onConfirm={this.handleDatePickedFinal}
            onCancel={this.hideDateTimePickerFinal}
            mode={"date"}
          />
          <Text>{dataFinal}</Text>
          <Button title="data final da pesquisa" onPress={this.showDateTimePickerFinal} />
          <Button title="Busca" onPress={() => this.handleSeach()} />
          <Text>{this.state.msg}</Text>
        </View>
      );
    }

    if (!this.state.isLoading && this.state.pessoas.length == 0 && this.state.pagina > 1) {
      return (
        <View style={styles.container}>
          <Button title="Voltar" onPress={() => navigate('Orgaos')} />
          <Text>{dataInicial}</Text>

          <Button title="data inicial da pesquisa" onPress={this.showDateTimePickerInicial} />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerInicialVisible}
            onConfirm={this.handleDatePickedInicial}
            onCancel={this.hideDateTimePickerFinal}
            mode={"date"}
          />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerFinalVisible}
            onConfirm={this.handleDatePickedFinal}
            onCancel={this.hideDateTimePickerFinal}
            mode={"date"}
          />
          <Text>{dataFinal}</Text>
          <Button title="data final da pesquisa" onPress={this.showDateTimePickerFinal} />
          <Button title="Busuhuhuhuhuca" onPress={() => this.handleSeach()} />
          <Text>{this.state.msg}</Text>

          <View style={styles.containerFooter}>
            <View style={styles.button}>
              <Button
                title="aterior"
                onPress={() => this.handleLastPage()}
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Button title="Voltar" onPress={() => navigate('Orgaos')} />
        <Text>{dataInicial}</Text>

        <Button title="data inicial da pesquisa" onPress={this.showDateTimePickerInicial} />
        <DateTimePicker
          isVisible={this.state.isDateTimePickerInicialVisible}
          onConfirm={this.handleDatePickedInicial}
          onCancel={this.hideDateTimePickerFinal}
          mode={"date"}
        />
        <DateTimePicker
          isVisible={this.state.isDateTimePickerFinalVisible}
          onConfirm={this.handleDatePickedFinal}
          onCancel={this.hideDateTimePickerFinal}
          mode={"date"}
        />
        <Text>{dataFinal}</Text>
        <Button title="data final da pesquisa" onPress={this.showDateTimePickerFinal} />
        <Button title="Busca" onPress={() => this.handleSeach()} />

        <FlatList
          data={this.state.pessoas}
          renderItem={({ item }) =>
            <TouchableOpacity onPress={() => {
              navigate('Pessoa', { 'pessoa': item })
            }}>
              <View>
                <Text style={styles.item}> {item.pessoa.nome}</Text>
              </View>
            </TouchableOpacity>}
        />
        <View style={styles.containerFooter}>
          <View style={styles.button}>
            <Button
              title="aterior"
              onPress={() => this.handleLastPage()}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Proxima"
              onPress={() => this.handleNextPage()}
            />
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    width: 390

  },

  containerFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: 'green',
    width: '40%',
    height: 40
  }

});