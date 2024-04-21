import {StyleSheet} from 'react-native';

const loginStyles = StyleSheet.create({
  background_container: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input_container: {
    width: '100%',
    marginTop: 50,
    padding: 10,
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '90%',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 64,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#35B6FF',
  },
  button_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#35B6FF',
  },
  link: {
    marginTop: 10,
    marginStart: 20,
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 14,
    color: '#469FD1',
  },
});

export default loginStyles;
