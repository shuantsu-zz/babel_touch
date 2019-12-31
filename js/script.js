$(function(){
	var esperar = false,
		sempre_mover_last_state = false,
		quadrados_resolvidos = $('.quadrado');
	
	$.fx.speeds._default = 100;
	
	function swap(el1, el2) {
		var _el1, el1_before = $(el1).prev();
			
			_el1 = el1.remove();
			
			el2.after(_el1);
			
			_el2 = el2.remove();
			
			el1_before.after(_el2);
			
	}
	
	function swipe(row, direction, atropelar) {
	
		var $row = $('.row_' + row),
			$espacos = $row.find('.espaco'),
			$quadrados = $row.find('.quadrado'),
			$espaco_removido,
			$quadrado_removido,
			animate = $('#animate').prop('checked'),
			atropelar = atropelar || false;
		
		if (!atropelar) {
			if (esperar) {
				return
			}
		}
		
		if (direction == 'up') {
			
			if (animate) {
			
				$row.stop().animate({marginTop: '-62px'}, function(){
					$espaco_removido = $espacos.first().remove();
					$quadrado_removido = $quadrados.first().remove();
					$row.append($espaco_removido).append($quadrado_removido);
					$row.css({marginTop: 0});
				});
			
			} else {
				$espaco_removido = $espacos.first().remove();
				$quadrado_removido = $quadrados.first().remove();
				$row.append($espaco_removido).append($quadrado_removido);
			}
			
		}
		
		if (direction == 'down') {
		
			if (animate) {
				$row.css({marginTop: '-62px'});
			}
			$espaco_removido = $espacos.last().remove();
			$quadrado_removido = $quadrados.last().remove();
			$row.prepend($quadrado_removido).prepend($espaco_removido);
			if (animate) {
				$row.stop().animate({marginTop: '0px'});
			}
			
		}
		
		if (animate) {
			esperar = true;
			setTimeout(function (){esperar = false}, $.fx.speeds._default);
		}
		
	}
	
	function vazio() {
		return $('[class^=row]').find('.vazio');
	}
	
	function colVazio() {
		return $('[class^=row]').has('.vazio');
	}
	
	function shake() {
		$('.babel').effect('shake');
	}
	
	function moverQuadrado(direcao) {
	
		var $vazio = vazio(),
			vazio_index = $vazio.index();
			col = colVazio().attr('class'),
			leftmost = $('.row_left div').eq(vazio_index),
			center = $('.row_center div').eq(vazio_index),
			rightmost = $('.row_right div').eq(vazio_index),
			animate = $('#animate').prop('checked'),
			sempre_mover = $('#sempre_mover').prop('checked');

		if (esperar) {
			return;
		}
			
		if (vazio_index <= 5 || sempre_mover) {
			
			if (direcao == 'esquerda') {
			
				if (col == 'row_left') {
					if (animate) {
						center.css('position','relative').animate({marginLeft: '-86px'}, function(){
							swap(center, $('.' + col + ' .vazio'));
							center.css({position: 'static', marginLeft: 0})
						});
					} else {
						swap(center, $('.' + col + ' .vazio'));
					}
				}
				
				if (col == 'row_center') {
					if (animate) {
						rightmost.css('position','relative').animate({marginLeft: '-86px'}, function(){
							swap(rightmost, $('.' + col + ' .vazio'));
							rightmost.css({position: 'static', marginLeft: 0})
						});
					} else {
						swap(rightmost, $('.' + col + ' .vazio'));
					}
				}
				
				if (col == 'row_right') {
					shake();
				}
				
			}
			
			if (direcao == 'direita') {
			
				if (col == 'row_right') {
					if (animate) {
						center.css('position','relative').animate({left: '86px'}, function(){
							swap(center, $('.' + col + ' .vazio'));
							center.css({position: 'static', left: 0})
						});
					} else {
						swap(center, $('.' + col + ' .vazio'));
					}
				}
				
				if (col == 'row_center') {
					if (animate) {
						leftmost.css('position','relative').animate({left: '86px'}, function(){
							swap(leftmost, $('.' + col + ' .vazio'));
							leftmost.css({position: 'static', left: 0})
						});
					} else {
						swap(leftmost, $('.' + col + ' .vazio'));
					}
				}
				
				if (col == 'row_left') {
					shake();
				}
				
			}
			
			if (animate) {
				esperar = true;
				setTimeout(function (){esperar = false}, 410);
			}
			
		} else {
			shake();
			return;
		}
	}
	
	function embaralharArray(array) {
		var indice_atual = array.length, valor_temporario, indice_aleatorio;
	 
		while (0 !== indice_atual) {
	 
			indice_aleatorio = Math.floor(Math.random() * indice_atual);
			indice_atual -= 1;
	 
			valor_temporario = array[indice_atual];
			array[indice_atual] = array[indice_aleatorio];
			array[indice_aleatorio] = valor_temporario;
		}
	 
		return array;
	}
	
	function resolver() {
		$('.quadrado').remove();
		$('.espaco').each(function(i, v){
			$(v).after(quadrados_resolvidos[i]);
		});
	}
	
	function embaralhar() {
		
		var quadrados = $('.quadrado').remove();
		embaralharArray(quadrados);
		
		$('.espaco').each(function(i, v){
			$(v).after(quadrados[i]);
		});
		
	}
	
	$("#godmode").click(function(){
		if ($(this).prop('checked')) {
			$('.babel').stop().animate({height: '384px'});
			sempre_mover_last_state = $('#sempre_mover').prop('checked');
			$('#sempre_mover').attr('disabled', true).prop('checked', true);
		} else {
			$('.babel').stop().animate({height: '197px'});
			$('#sempre_mover').attr('disabled', false).prop('checked', sempre_mover_last_state);
		}
	});
	
	$('#embaralhar').click(embaralhar);
	
	$("#resolver").click(resolver);
	
	(function() {
	
		var row_left = new Hammer($(".row_left")[0], {domEvents: true});
		var row_center = new Hammer($(".row_center")[0], {domEvents: true});
		var row_right = new Hammer($(".row_right")[0], {domEvents: true});
		var babel = new Hammer($(".babel")[0], {domEvents: true});
		var jogo = new Hammer($(".jogo")[0], {domEvents: true});
		
		row_left.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
		row_center.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
		row_right.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
		jogo.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
		
		$(".row_left").on("swipeup", function(e){
			e.stopPropagation();
			swipe('left', 'up');
		});
		
		$(".row_left").on("swipedown", function(e){
			e.stopPropagation();
			swipe('left', 'down');
		});
		
		$(".row_center").on("swipeup", function(e){
			e.stopPropagation();
			swipe('center', 'up');
		});
		
		$(".row_center").on("swipedown", function(e){
			e.stopPropagation();
			swipe('center', 'down');
		});
	
		$(".row_right").on("swipeup", function(e){
			e.stopPropagation();
			swipe('right', 'up');
		});
		
		$(".row_right").on("swipedown", function(e){
			e.stopPropagation();
			swipe('right', 'down');
		});
	
		$(".babel").on("swipeleft", function() {
			moverQuadrado("esquerda");
		});
		
		$(".babel").on("swiperight", function() {
			moverQuadrado("direita");
		});
	
		$(".jogo").on("swipeup", function(e) {
			swipe('right', 'up', true);
			swipe('center', 'up', true);
			swipe('left', 'up', true);
		});
		
		$(".jogo").on("swipedown", function() {
			swipe('right', 'down', true);
			swipe('center', 'down', true);
			swipe('left', 'down', true);
		});
	
	})();
	
});